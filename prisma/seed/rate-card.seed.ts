import { prisma } from "./util";
import rateCardData from "./data/rate-card.data";

export async function addRateCard() {

    const rateCardCount = await prisma.rateCard.count();
    console.log('rateCard Count found', rateCardCount)
    if (rateCardCount < 1) {
        const rateCardAdded = await prisma.rateCard.createMany({
            data: rateCardData
        })
        console.log('added rate card list', rateCardAdded.count)
    }
}
