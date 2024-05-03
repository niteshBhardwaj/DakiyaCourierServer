import { prisma } from "./util";

export async function addConfig() {

    const configCount = await prisma.appConfig.count();
    console.log('config Count found', configCount)
    if (configCount < 1) {
        const configAdded = await prisma.appConfig.createMany({
            data: {
                codCharges: {
                    minimum: "40",
                    percentage: "2"
                },
                taxCharges: [{
                    name: "CGST",
                    percentage: "9",
                    type: "GSt"
                }, {
                    name: "SGST",
                    percentage: "9",
                    type: "GSt"
                }],
                extraCharges: [{
                    name: "DPH",
                    percentage: "1.5",
                    type: "GSt"
                }]
            }
        })
        console.log('added config', configAdded.count)
    }
}
