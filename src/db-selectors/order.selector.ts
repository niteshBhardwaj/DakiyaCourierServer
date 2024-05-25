
export const createOrderSelector = {
    id: true,
    orderId: true,
    pickupId: true,
    dropId: true,
    paymentMode: true,
    shippingMode: true,
    weight: true,
    status: true,
    isFragile: true,
    invoiceNo: true,
    boxHeight: true,
    boxWidth: true,
    boxLength: true,
    codAmount: true,
    totalAmount: true,
    products: true,
    courierId: true,
    expectedDeliveryDate: true,
    reverseInTransit: true,
    awb: true,
    userId: true,
    pickupAddress: {
      include: {
        pickupProvider: true
      },
    },
    dropAddress: true,
  }