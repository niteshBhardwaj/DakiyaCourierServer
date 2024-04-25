import { ShippingMode, Zone } from "@prisma/client";
import { prisma } from "./config";

export async function addCourierPartners() {

    const courierCount = await prisma.courierPartner.count();
    console.log('courier count found', courierCount)
    if (courierCount < 1) {
        const courierAdded = await prisma.courierPartner.createMany({
            data: [
                {
                    name: "Delivery",
                    slug: 'delivery',
                    isActive: true,
                    rateCard: [{
                        title: "Surface - 500 g to 4 kg Rates",
                        mode: ShippingMode.Surface,
                        type: 'Forward',
                        base: 0.5,
                        increment: 0.5, 
                        upto: 4,
                        rates: [{
                            zone: Zone.ZoneA,
                            baseRate: 30,
                            incrementRate: 29 
                          }, 
                          {
                            zone: Zone.ZoneB,
                            baseRate: 33,
                            incrementRate: 32 
                          }, {
                            zone: Zone.ZoneC,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneD,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneE,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneF,
                            baseRate: 30,
                            incrementRate: 29 
                          }]
                    }, {
                        title: "Surface - 500 g to 4 kg Rates",
                        mode: ShippingMode.Surface,
                        type: 'Forward',
                        base: 5,
                        increment: 1, 
                        upto: null,
                        rates: [{
                            zone: Zone.ZoneA,
                            baseRate: 30,
                            incrementRate: 29 
                          }, 
                          {
                            zone: Zone.ZoneB,
                            baseRate: 33,
                            incrementRate: 32 
                          }, {
                            zone: Zone.ZoneC,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneD,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneE,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneF,
                            baseRate: 30,
                            incrementRate: 29 
                          }]
                    }, {
                        title: "Base Fare (upto 500 g)",
                        mode: ShippingMode.Air,
                        type: 'Forward',
                        base: 0.5,
                        increment: 0.5, 
                        upto: 4,
                        rates: [{
                            zone: Zone.ZoneA,
                            baseRate: 30,
                            incrementRate: 29 
                          }, 
                          {
                            zone: Zone.ZoneB,
                            baseRate: 33,
                            incrementRate: 32 
                          }, {
                            zone: Zone.ZoneC,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneD,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneE,
                            baseRate: 30,
                            incrementRate: 29 
                          }, {
                            zone: Zone.ZoneF,
                            baseRate: 30,
                            incrementRate: 29 
                          }]
                    }],
                }
            ]
        })
        console.log('added courier list', courierAdded.count)
    }
}


// export async function addApiConfig() {

//     const apiConfigCount = await prisma.apiConfig.count();
//     console.log('api config count found', apiConfigCount)
//     if (apiConfigCount < 1) {
//         const courierPartner = await prisma.courierPartner.findFirst({ where: { slug: 'delivery' } });
//         if (courierPartner) {
//             const apiConfigAdded = await prisma.apiConfig.createMany({
//                 data: [
//                     {
//                         type: ApiType.PincodeServicebility,
//                         endpoint: '/c/api/pin-codes/json/',
//                         method: 'GET',
//                         responseMapper: {
//                             mapping: `$map($filter(delivery_codes, function($v) {
//                                 $v.postal_code.country_code = "IN"
//                               }), function($item) {
//                                 {
//                                 "isPrepaid": $item.postal_code.pre_paid = "Y" ? true : false,
//                                 "isCash": $item.postal_code.cash = "Y" ? true : false,
//                                 "isCod": $item.postal_code.cod = "Y" ? true : false,
//                                 "isOda": $item.postal_code.is_oda = "Y" ? true : false,
//                                 "maxWeight": $item.postal_code.max_weight,
//                                 "maxAmount": $item.postal_code.max_amount,
//                                 "remarks": $item.remarks,
//                                 "pincode": $item.postal_code.pin,
//                                 "center": $item.postal_code.center,
//                                 "courierId": $courierId
//                                 }
//                             })`,
//                         },
//                         courierId: courierPartner.id
//                     },
//                     {
//                         type: ApiType.CreateWarehouse,
//                         endpoint: '/api/backend/clientwarehouse/create/',
//                         method: 'POST',
//                         requestMapping: {
//                             mapping: `{
//                             "phone": phone,
//                             "city": city,
//                             "name": name,
//                             "pin": pincode,
//                             "address": address,
//                             "country": country,
//                             "email": email,
//                             "registered_name": name,
//                              "return_address": returnAddress.address,
//                              "return_pin": returnAddress.pincode,
//                              "return_city": returnAddress.city,
//                              "return_state": returnAddress.state,
//                              "return_country": returnAddress.country
//                           }
//                         `},
//                         responseMapper: {},
//                         courierId: courierPartner.id
//                     },
//                     {
//                         type: ApiType.Order,
//                         endpoint: '/api/cmu/create.json',
//                         method: 'POST',
//                         beforeActions: [{
//                             name: 'AddWarehouse',
//                             source: 'External',
//                             apiType: ApiType.CreateWarehouse,
//                             evalMapper: ``,
//                             payloadMapper: ''
//                         }],
//                         afterActions: [{
//                             name: 'Pickup',
//                             source: 'External',
//                             apiType: ApiType.Pickup,
//                             evalMapper: ``,
//                             payloadMapper: ''
//                         }],
//                         requestMapping: {
//                             mapping: `{
//                             "shipments": [
//                                 {
//                                     "add": dropAddress.address,
//                                     "phone": dropAddress.phone,
//                                     "payment_mode": paymentMode,
//                                     "name": dropAddress.name,
//                                     "pin": dropAddress.pincode,
//                                     "state": dropAddress.state,
//                                     "city": dropAddress.city,
//                                     "order": "0",
//                                     "shipping_mode": shippingMode,
//                                     "weight": weight,
//                                     "od_distance": "",
//                                     "fragile_shipment": isFragile,
//                                     "shipment_height": boxHeight,
//                                     "shipment_length": boxLength,
//                                     "shipment_width": boxWidth,
//                                     "category_of_goods": "",
//                                     "cod_amount": codAmount,
//                                     "return_city": pickupAddress.returnAddress.address,
//                                     "return_phone": pickupAddress.phone,
//                                     "return_state": pickupAddress.returnAddress.state,
//                                     "return_country": pickupAddress.returnAddress.country,
//                                     "return_add": pickupAddress.returnAddress.address,
//                                     "dangerous_good": "False",
//                                    "order_date": "",
//                                     "total_amount": totalAmount,
//                                     "seller_add": dropAddress.address,
//                                     "country": dropAddress.country,
//                                     "return_pin": pickupAddress.returnAddress.pincode,
//                                     "return_name": pickupAddress.name
//                                 }
//                             ],
//                             "pickup_location": {
//                                 "name": pickupAddress.name,
//                                 "city": pickupAddress.city,
//                                 "pin": pickupAddress.pincode,
//                                 "country": pickupAddress.country,
//                                 "phone": pickupAddress.phone,
//                                 "add": pickupAddress.address
//                             }
//                         }`
//                         },
//                         responseMapper: {
//                             mapping: null,
//                         },
//                         courierId: courierPartner.id
//                     },
//                     {
//                         type: ApiType.Pickup,
//                         endpoint: '/fm/request/new/',
//                         method: 'POST',
//                         requestMapping: {
//                             mapping: `{
//                                 "pickup_time": pickupTime,
//                                 "pickup_date": pickupDate,
//                                 "pickup_location": pickupLocation,
//                                 "expected_package_count": packageCount
//                             }`
//                         },
//                         responseMapper: {
//                             mapping: ``,
//                         },
//                         courierId: courierPartner.id
//                     },
//                 ]
//             })
//             console.log('added api config list', apiConfigAdded.count)
//         } else {
//             console.log('no courier partner found')
//         }
//     }
// }