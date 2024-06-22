import LoggerInstance from '~/plugins/logger';
import Container, { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '~/decorators/eventDispatcher';
import { type Order, OrderStatus, PrismaClient, AppConfig, Tracking, DropAddress, TransactionType } from '@prisma/client';
import { CreateOrderInput, OrderDetailInput } from '~/graphql-type/args/order.input';
import { badRequestException, badUserInputException } from '~/utils/exceptions.util';
import CourierPartnerService from './courier-partners.service';
import CounterService from './counter.service';
import { OrderType } from '~/graphql-type/typedefs/order.type';
import { PrismaSelect } from '@paljs/plugins/dist/select';
import { GraphQLResolveInfo } from 'graphql';
import { createOrderSelector } from '~/db-selectors/order.selector';
import { OffsetInput } from '~/graphql-type/args/common.input';
import { APP_CONFIG } from '~/constants';
import { dateDifference } from '~/utils/date.utils';
import { groupBy, lastTrackingCheckingQuery, withResolvers } from '~/utils';
import RateCalculatorService from './rate-calculator.service';
import PickupAddressService from './pickup-address.service';
import DropAddressService from './drop-address.service';
import WalletService from './wallet.service';

@Service()
export default class OrderService {
  constructor(
    @Inject('prisma') private prisma: PrismaClient,
    @Inject('logger') private logger: typeof LoggerInstance,
    @Inject() private courierPartnerService: CourierPartnerService,
    @Inject() private counterService: CounterService,
    @Inject() private rateCalculatorService: RateCalculatorService,
    @Inject() private pickupAddressService: PickupAddressService,
    @Inject() private dropAddressService: DropAddressService,
    @Inject() private walletService: WalletService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async getOrderDetail({ input, userId }: { input: OrderDetailInput, userId: string }, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info as any).value
    const where = {} as Record<string, any>;
    if (!(input.awb || input.courierId)) {
      throw badRequestException('Please provide awb id.')
    }
    if (input.courierId) {
      where.id = input.courierId;
    } else if (input.awb) {
      where.awb = input.awb;
    }

    // TODO:// remove some of the field if user is not logged in;

    const data = await this.prisma.order.findFirst({
      where,
      ...select
    })

    if (!data) {
      throw badUserInputException('Courier not found.')
    }
    return data as unknown as OrderType;
  }

  public async getOrderCount({ userId, where }: { userId: string, where?: Record<string, any> }) {

    return this.prisma.order.count({
      where: {
        userId,
        ...where
      }
    })
  }
  public async getOrderList({ input, userId }: { input: OffsetInput; userId: string }, info: GraphQLResolveInfo) {
    const { take = 10, skip = 0 } = input
    const select = new PrismaSelect(info as any).value
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      ...select
    })
    return orders as unknown as OrderType[]
  }

  public async createOrder({ input, userId }: { input: CreateOrderInput; userId: string }, info: GraphQLResolveInfo) {
    // calculate order value
    const { paymentMode, shippingMode, weight, boxHeight, boxWidth, boxLength, codAmount } = input
    const pickupAddress = await this.pickupAddressService.findById({ id: input.pickupId, userId })
    const dropAddress = await this.dropAddressService.findById({ id: input.dropId, userId })
    // get rate
    const rate = await this.rateCalculatorService.rateCalculator({
      sourcePincode: pickupAddress.pincode,
      destinationPincode: dropAddress.pincode,
      paymentMode,
      shippingMode,
      weight,
      boxHeight,
      boxWidth,
      boxLength,
      codAmount
    })

    // check and throw exception if wallet balance is not sufficient
    // await this.walletService.checkWalletBalance({ userId, amount: rate.totalAmountWithTax });

    const courier = await this.prisma.courierPartner.findFirst();
    const courierId = courier?.id

    if (!courierId) {
      throw badRequestException('Service unavailable. Please try again later.');
    }

    const { orderId, awb } = (await this.counterService.generateAwbAndOrderId({ count: 1 }))[0];
    // deduct money from wallet, and check and throw exception if wallet balance is not sufficient
    const walletInfo = await this.walletService.updateWalletAndSaveTransaction({
      userId,
      type: TransactionType.Debit,
      amount: rate.totalAmountWithTax,
      description: 'Order creation',
      orderId: null
    });

    try {
      // create order
      const order = await this.prisma.order.create({
        data: {
          userId,
          orderId,
          awb,
          charges: {
            baseAmount: rate.baseAmount,
            totalAmount: rate.totalAmount,
            totalAmountWithTax: rate.totalAmountWithTax,
            cod: rate.cod,
            taxes: rate.taxes,
            extraCharges: rate.extraCharges
          },
          ...input,
          status: OrderStatus.Created,
        },
        select: createOrderSelector
      })

      // update order id in transcation
      await this.walletService.updateTransaction({ id: walletInfo.transaction.id, data: { orderId: order.id } });

      this.courierPartnerService.createOrder({ order, courierId })
      return order as unknown as OrderType;

    } catch (e) {
      console.log(e)
      throw badUserInputException('Order creation failed')
    }

  }

  public async editOrder({ input, userId }: { input: CreateOrderInput; userId: string }, info: GraphQLResolveInfo) {
    const select = new PrismaSelect(info).value
    const order = await this.prisma.order.update({
      where: {
        id: "",
        userId
      },
      data: {
        userId,
        ...input,
      },
      ...select
    })
    return order as unknown as OrderType
  }

  public async getTracking({ input }: { input: OrderDetailInput, userId: string; }, info: GraphQLResolveInfo) {
    // get order info
    const order = await this.prisma.order.findFirst({
      where: {
        id: input.courierId
      },
      select: {
        id: true,
        createdAt: true,
        currentStatusExtra: true,
        courierId: true,
        waybill: true,
      }
    })

    // check order exist
    if (!order) {
      throw badUserInputException('Order not found')
    }
    // check if tracking last checked is expired
    const { lastChecked } = order.currentStatusExtra ?? {};
    const appConfig = Container.get(APP_CONFIG) as AppConfig[];
    const { single } = appConfig[0].trackingRefresh;
    console.log(lastChecked, dateDifference(new Date(), lastChecked), single);
    if (!lastChecked || dateDifference(new Date(), lastChecked) > single) {
      const { promise, resolve } = withResolvers();
      this.courierPartnerService.getTracking({
        orders: [{
          id: order.id,
          waybill: order.waybill,
          lastChecked: lastChecked ?? order.createdAt,
          lastStatusDateTime: order?.currentStatusExtra?.dateTime ?? order.createdAt
        }],
        courierId: order.courierId,
        resolveAll: resolve,
      });
      await promise;
    }

    const scans = this.prisma.tracking.findMany({
      where: {
        orderId: order.id
      }
    })
    return scans;
  }

  public async checkAllActiveOrdersTracking() {
    const orders = await this.prisma.order.findMany(lastTrackingCheckingQuery())

    if (orders.length) {
      // update last checked date
      console.log('checking tracking - ', orders.length, orders?.map(order => order.id));
      await this.prisma.order.updateMany({
        where: {
          id: {
            in: orders.map(order => order.id)
          }
        },
        data: {
          currentStatusExtra: {
            set: {
              lastChecked: new Date()
            }
          }
        }
      })
      const orderGroupBy = groupBy(orders, "courierId");
      const allPromises = [];
      Object.keys(orderGroupBy).forEach(courierId => {
        const ordersList = orderGroupBy[courierId];
        const { promise, resolve } = withResolvers();
        allPromises.push(promise);
        this.courierPartnerService.getTracking({
          orders: ordersList.map(order => ({
            id: order.id,
            waybill: order.waybill,
            lastChecked: order.currentStatusExtra?.lastChecked ?? order.createdAt,
            lastStatusDateTime: order?.currentStatusExtra?.dateTime ?? order.createdAt
          })),
          courierId: courierId,
          resolveAll: resolve,
        });
      })
      await Promise.all(allPromises);
      // call next iteration
      this.checkAllActiveOrdersTracking();
    } else {
      console.log('no more orders found to check tracking');
    }
  }


  public async updateOrder({ data, id }: { data: Order; id: string }) {
    return this.prisma.order.update({
      where: {
        id
      },
      data
    })
  }

  public async updateTracking({ trackingList }: { trackingList: Tracking[] }) {
    if (!trackingList.length) {
      return;
    }
    return this.prisma.tracking.createMany({
      data: trackingList
    })
  }

  public async updateMultipleOrders({ orders }: { orders: any[] }) {
    console.log(JSON.stringify(orders, null, 2));
    return this.prisma.$transaction(
      orders.map((order) => this.prisma.order.update(order))
    )
  }

}
