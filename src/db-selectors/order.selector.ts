
export const createOrderSelector = {
    id: true,
    orderId: true,
    pickupId: true,
    dropId: true,
    paymentMode: true,
    shippingMode: true,
    weight: true,
    isFragile: true,
    boxHeight: true,
    boxWidth: true,
    boxLength: true,
    codAmount: true,
    totalAmount: true,
    products: true,
    courierId: true,
    pickupAddress: {
      include: {
        pickupProvider: true
      },
    },
    dropAddress: true,
  }