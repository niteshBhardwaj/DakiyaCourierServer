import jsonata from "jsonata";
import { env } from "@/plugins/config";
import { DELIVERY_API_URL } from "../delhivery.constant";
import { createOrderMapping, createWarehouseMapping, pickupMapping, pincodeServicebilityMapping, updateWarehouseMapping } from "../delhivery.mapping";
import { httpGet, httpPost } from "@/utils";
import { mappingEvaluate } from "./common.delhivery.utils";

const getUrl = (url: string) => {
    return `${env.DELHIVERY_API}${url}`
}

const getAuthSecret = () => {
    return `secret=${env.DELHIVERY_TOKEN}`
}

export const createRequestURL = ({ path, queryString }: { path: string; queryString?: string; }) => {
    const url = `${getUrl(path)}?${getAuthSecret()}${queryString ? `&${queryString}` : ''}`;
    return url;
}

export const getPincodeSericeability = async ({ courierId }: { courierId: string }) => {
    try {
        const url = createRequestURL({ path: DELIVERY_API_URL.PINCODE_SERVICEABILITY });
        const { response: responeMapping } = pincodeServicebilityMapping;
        let { data } = await httpGet(url);
        const expression = jsonata(responeMapping);
        const result = await expression.evaluate(data, { courierId });
        return result
    } catch (e) {
        console.log(e);
    }
}

export const createWarehouse = async ({ warehouseData }: { warehouseData: any }) => {
    try {
        const url = createRequestURL({ path: DELIVERY_API_URL.CREATE_WAREHOUSE });
        const { payloadMapping } = createWarehouseMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(warehouseData);
        const { data } = await httpPost(url, { body: payload });
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const updateWarehouse = async ({ warehouseData }: { warehouseData: any }) => {
    try {
        const url = createRequestURL({ path: DELIVERY_API_URL.UPDATE_WAREHOUSE });
        const { payloadMapping } = updateWarehouseMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(warehouseData);
        return httpPost(url, { body: payload });
    } catch (e) {
        console.log(e);
    }
}

export const createOrder = async ({ orderData }: { orderData: any }) => {
    try {
        const url = createRequestURL({ path: DELIVERY_API_URL.CREATE_ORDER });
        const { payloadMapping } = createOrderMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(orderData);
        const { data } = await httpPost(url, { body: payload });
        if (data.success) {
        return {
                data,
                orderData: data.packages.map((item: { status: string; waybill: string; refnum: string }) => ({
                    success: item.status === "Success",
                    waybill: item.waybill,
                    orderId: item.refnum
                }))
            }
        } else {
            return {
                data,
                orderData: null
            }
        }
    } catch (e) {
        // TODO: // log error
        console.error(e);
    }
    return {
        data: null,
        orderData: null
    }
}

export const createPickupRequest = async ({ pickupData }: { pickupData: object }) => {
    try {
        const url = createRequestURL({ path: DELIVERY_API_URL.PICKUP_REQUEST });
        const { payloadMapping, responseMapping } = pickupMapping;
        const payload = mappingEvaluate(payloadMapping, pickupData);
        const { data } = await httpPost(url, { body: payload });
        if (data.pr_exists) {
            return null;
        }
        const evaluatedData = await mappingEvaluate(responseMapping, data);
        return evaluatedData;
    } catch (e) {
        console.log(e);
    }
}