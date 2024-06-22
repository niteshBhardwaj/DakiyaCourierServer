import { AppConfig, OrderStatus } from "@prisma/client";
import Container from "typedi";
import { APP_CONFIG } from "~/constants";

export const getAwbAndOrderUtil = (count: number, awbNumber: number) => {
    const numbers = Array(count).fill(awbNumber).map((count, index) => count - index).sort((a, b) => a - b);
    const dateString = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return numbers.map(number => {
        const orderId = `${number.toString().padStart(5, '0')}`;
        return {
            orderId,
            awb: `${dateString}${orderId}`
        }
    })
  }

  export const lastTrackingCheckingQuery = () => {
    const appConfig = Container.get(APP_CONFIG) as AppConfig[]; 
    const { all } = appConfig[0].trackingRefresh; // all minutes
    return {
        where: {
          courierId: {
            not: null
          },
          status: {
            notIn: [
              OrderStatus.Delivered,
              OrderStatus.Cancelled
            ]
          },
          OR: [{
              currentStatusExtra: null
          },
            {
              currentStatusExtra: {
                is: {
                    lastChecked: {
                      lt: new Date(Date.now() - all * 60 * 1000)
                    },
                },
              }
            }
          ]
        },
        select: {
          id: true,
          createdAt: true,
          currentStatusExtra: true,
          courierId: true,
          waybill: true,
        },
        take: 10
      }
  }