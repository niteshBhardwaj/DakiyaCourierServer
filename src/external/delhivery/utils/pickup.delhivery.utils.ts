import { isSameDate } from "~/utils/date.utils"
import { PickupResponseType } from "../delhivery.type"
import { DateType } from "~/types/common.type"

export const checkPickupForGivenDate = (pickupResponse?: PickupResponseType[] | null, pickupDate?: DateType) => {

    if(pickupResponse?.length) {
        const found = pickupResponse?.some((item: PickupResponseType) => {
            return isSameDate(item.pickupDate, pickupDate)
        })
        return found;
    }
    return false
}