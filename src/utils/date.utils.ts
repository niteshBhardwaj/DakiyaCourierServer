import { DateType } from "@/types/common.type";
import dayjs, { ManipulateType } from "dayjs"
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday)

export const isTodayDate = (date?: DateType) => {
    if(!date) {
        return false;
    }
    return dayjs(date).isToday();
}

export const isSameDate = (date?: DateType, date1?: DateType) => {
    if(!date || date1) return false;
    return dayjs(date).isSame(date1)
}

export const createFutureDate = (value: number, unit: ManipulateType) => {
    return dayjs(new Date()).add(value, unit).toDate();
}