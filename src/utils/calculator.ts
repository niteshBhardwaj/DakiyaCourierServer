import { Admin1, Admin2, AppConfig, PaymentMode, Pincode, RateCard, ShippingMode, Zone } from "@prisma/client";
type PincodeType = Pick<Pincode, "pincode"> & { Admin2: Pick<Admin2, "name" | "code" | "tags"> & { Admin1: Pick<Admin1, "name" | "code" | "tags"> } }


const zoneConfig = {
    city: {},
    withinKM: {
        km: 500
    },
    metroToMetro: {},
    restOfIndia: {},
    specialZones1: {
        tags: ['NorthEast'],
        stateInclude: [{ name: 'Himachal Pradesh', code: '11', }],
        stateExclude: [{ name: 'Manipur', code: '17', }],
    },
    specialZones2: {
        stateInclude: [
            { name: 'Jammu & Kashmir', code: '12', },
            { name: 'Manipur', code: '17', },
            { name: 'Ladakh', code: '41', },
            { name: 'Andaman & Nicobar Islands', code: '01', }
        ],
    }
}

const getZoneType = ({ source, destination }: { source: PincodeType, destination: PincodeType }) => {
    let type: Zone = Zone.ZoneD;
    const sourceState = source.Admin2.Admin1;
    const destinationState = destination.Admin2.Admin1;
    const isSameState = source.Admin2.Admin1.code === destination.Admin2.Admin1.code;
    const isSourceStateCity = source.Admin2.Admin1.tags.includes('City');
    const isDestinationStateCity = destination.Admin2.Admin1.tags.includes('City');
    const isSameCity = source.Admin2.code === destination.Admin2.code || (isSameState && source.Admin2.Admin1.tags.includes('City') && destination.Admin2.Admin1.tags.includes('City'));
    let isWithinKM = false;
    let isMetroToMetro = false;
    let isSpecialZones1 = false;
    let isSpecialZones2 = false;
    let isRestIndia = false;

    // check for special zones2;
    if (zoneConfig.specialZones2.stateInclude.find(config => sourceState.code === config.code) || zoneConfig.specialZones2.stateInclude.find(config => sourceState.code === config.code)) {
        isSpecialZones2 = true;
        type = Zone.ZoneF;
        // check for special zones1;
    } else if (zoneConfig.specialZones1.tags.some(tag => sourceState.tags.includes(tag) || destinationState.tags.includes(tag))
        || zoneConfig.specialZones1.stateInclude.some(config => sourceState.code === config.code || destinationState.code === config.code) && !zoneConfig.specialZones1.stateExclude.some(config => (sourceState.code === config.code || destinationState.code === config.code))) {
        isSpecialZones1 = true;
        type = Zone.ZoneE;
        // check for metro to metro city
    } else if ((isSourceStateCity && sourceState.tags.includes('Metro')) || source.Admin2.tags.includes('Metro') && ((isDestinationStateCity && destinationState.tags.includes('Metro')) || destination.Admin2.tags.includes('Metro'))) {
        isMetroToMetro = true;
        type = Zone.ZoneC;
        // check for within 500 kms
    } else if (false && isSameState) {
        // check for within 500 kms - zoneB;

        // check for rest of India
    } else {
        isRestIndia = true;
        type = Zone.ZoneD;
    }
    // check if same city;
    if (isSameCity) {
        type = Zone.ZoneA;
    }

    return { zoneType: type, isSameCity, isSameState, isWithinKM, isRestIndia, isMetroToMetro, isSpecialZones1, isSpecialZones2 };
}

export const getActualWeight = ({ weight, boxHeight, boxWidth, boxLength }: { weight: number, boxHeight: number, boxWidth: number, boxLength: number }) => {
    const volumetricWeight = (boxHeight * boxWidth * boxLength) / 5000;
    return volumetricWeight > weight ? volumetricWeight : weight;
}

export const findZoneAndAmount = ({ weight, source, destination, shippingMode, rateCard }: { weight: number; source: PincodeType; destination: PincodeType; shippingMode: ShippingMode, rateCard: RateCard }) => {
    const { zoneType } = getZoneType({ source, destination });
    const card = rateCard.userRateCard.find(card => {
        if (card.mode === shippingMode) {
            const uptoBase = Number(card.base);
            const max = Number(card.upto) || Infinity;
            return weight <= uptoBase || weight <= max;
        }
        return false;
    })
    if (!card) {
        throw new Error('Rate card not found');
    }
    const { baseRate = 0, incrementRate = 0 } = card?.rates.find(rate => rate.zone === zoneType) || {};
    const incrementTotal = Math.ceil((weight - Number(card.base)) / Number(card.increment)) * Number(incrementRate);
    const amount = Number(baseRate) + incrementTotal;
    // console.log({zoneType, weight, baseRate, base: card.base, increment: card.increment, incrementRate, incrementTotal, price});

    return { zone: zoneType, amount };
}

export const addTaxesCodCharges = ({ amount, appConfig, paymentMode, codAmount }: { amount: number, appConfig: AppConfig, paymentMode: PaymentMode, codAmount: number }) => {
    let priceBreakup = {
        baseAmount: amount,
        totalAmount: amount,
        totalAmountWithTax: 0,
        cod: 0,
        taxes: [] as { name: string, amount: number, type: string }[],
        extraCharges: [] as { name: string, amount: number, type: string }[]
    }
    const { codCharges, taxCharges, extraCharges } = appConfig
    // check of cod
    if (paymentMode === PaymentMode.CashOnDelivery) {
        priceBreakup.cod = Math.max(Number(codCharges.minimum), (codAmount * Number(codCharges.percentage)) / 100)
        priceBreakup.totalAmount += priceBreakup.cod
    }

    // check for extra charges
    extraCharges.forEach(charge => {
        let amt = (amount * Number(charge.percentage)) / 100
        if (amt > 0) {
            priceBreakup.extraCharges.push({ name: charge.name, amount: amt, type: charge.type })
            priceBreakup.totalAmount += amt;
        }
    })

    // tax calulation
    let totalTax = 0;
    taxCharges.forEach(charge => {
        let amt = (priceBreakup.totalAmount * Number(charge.percentage)) / 100
        if (amt > 0) {
            priceBreakup.taxes.push({ name: charge.name, amount: amt, type: charge.type })
            totalTax += amt;
        }
    })
    priceBreakup.totalAmountWithTax = priceBreakup.totalAmount + totalTax;

    return priceBreakup
}