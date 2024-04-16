
export enum EVENTS_ACTIONS {
    LOAD_PINCODE = "LOAD_PINCODE",
    CREATE_ORDER = "CREATE_ORDER",
    PICKUP_REQUEST = "PICKUP_REQUEST",
    UPDATE_ORDER = "UPDATE_ORDER",
    TRACKING = "TRACKING",
    NDR_ACTION = "NDR_ACTION"
}

export const delhiverySlug = 'delhivery'
export type CourierSlugType = typeof delhiverySlug;
export const CourierPartnersEvents = {
    [delhiverySlug]: {
        [EVENTS_ACTIONS.LOAD_PINCODE]: `${delhiverySlug}.loadPincode`,
        [EVENTS_ACTIONS.CREATE_ORDER]: `${delhiverySlug}.createOrder`,
        [EVENTS_ACTIONS.UPDATE_ORDER]: `${delhiverySlug}.updateOrder`,
        [EVENTS_ACTIONS.TRACKING]: `${delhiverySlug}.tracking`,
        [EVENTS_ACTIONS.NDR_ACTION]: `${delhiverySlug}.ndrAction`,
        [EVENTS_ACTIONS.PICKUP_REQUEST]: `${delhiverySlug}.pickupRequest`
    }
} satisfies Record<string, Record<string, string>>


export const checkEventAvailability = (slug: CourierSlugType, action: EVENTS_ACTIONS) => {
    if (CourierPartnersEvents[slug] && CourierPartnersEvents[slug][action]) {
        return true
    }
    return false
}

export const getCourierEvent = (slug: CourierSlugType, action: EVENTS_ACTIONS) => {
    if (CourierPartnersEvents[slug] && CourierPartnersEvents[slug][action]) {
        return CourierPartnersEvents[slug][action]
    }
    return ''
}

export const getDelhiveryEvent = () => {
    return CourierPartnersEvents[delhiverySlug]
}