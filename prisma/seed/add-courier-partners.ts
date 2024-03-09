import { ApiType, AuthSecretType } from "@prisma/client";
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
                    status: true,
                    authConfig: {
                        type: AuthSecretType.QUERY,
                        keyName: 'secret',
                        value: '55f9a3e1019f849ddc90696acc82532bd08d2bb7'
                    }
                }
            ]
        })
        console.log('added courier list', courierAdded.count)
    }
}


export async function addApiConfig() {

    const apiConfigCount = await prisma.apiConfig.count();
    console.log('api config count found', apiConfigCount)
    if (apiConfigCount < 1) {
        const courierPartner = await prisma.courierPartner.findFirst({ where: { slug: 'delivery' } });
        if (courierPartner) {
            const apiConfigAdded = await prisma.apiConfig.createMany({
                data: [
                    {
                        type: ApiType.PincodeServicebility,
                        endpoint: '/c/api/pin-codes/json/',
                        method: 'GET',
                        mapping: `$map(delivery_codes, function($item) {
                            {
                              "isPrepaid": $item.postal_code.pre_paid = "Y" ? true : false,
                              "isCash": $item.postal_code.cash = "Y" ? true : false,
                              "isCod": $item.postal_code.cod = "Y" ? true : false,
                              "isOda": $item.postal_code.is_oda = "Y" ? true : false,
                              "maxWeight": $item.postal_code.max_weight,
                              "maxAmount": $item.postal_code.max_amount,
                              "remarks": $item.postal_code.cash = "Y" ? true : false,
                              "pincode": $item.postal_code.pin,
                              "center": $item.postal_code.center
                            }
                        })`,
                        courierId: courierPartner.id
                    }
                ]
            })
            console.log('added api config list', apiConfigAdded.count)
        } else {
            console.log('no courier partner found')
        }
    }
}