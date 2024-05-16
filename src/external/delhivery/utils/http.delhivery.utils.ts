import jsonata from "jsonata";
import { env } from "~/plugins/config";
import { DELIVERY_API_URL } from "../delhivery.constant";
import { createOrderMapping, createWarehouseMapping, pickupMapping, pincodeServiceabilityMapping, updateWarehouseMapping } from "../delhivery.mapping";
import { httpGet, httpPost } from "~/utils";
import { mappingEvaluate, parseJson } from "./common.delhivery.utils";
import delhiveryPincode from '../../../../prisma/seed/data/delivery-pincode'

const getUrl = (url: string) => {
    return `${env.DELHIVERY_HOST}${url}`
}

const getAuthHeader = () => {
    return { 
        Authorization: `Token ${env.DELHIVERY_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

export const createRequest = ({ path, queryString }: { path: string; queryString?: string; }) => {
    const url = `${getUrl(path)}?${queryString ? `&${queryString}` : ''}`;
    return {url, headers: getAuthHeader()};
}

export const getPincodeServiceability = async ({ courierId }: { courierId: string }) => {
    try {
        const {url, headers } = createRequest({ path: DELIVERY_API_URL.PINCODE_SERVICEABILITY });
        const { response: responseMapping } = pincodeServiceabilityMapping;
        // let { data } = await httpGet(url, { headers });
        const data = delhiveryPincode;
        const expression = jsonata(responseMapping);
        const result = await expression.evaluate(data, { courierId });
        return result
    } catch (e) {
        console.log(e);
    }
}

export const createWarehouse = async ({ warehouseData }: { warehouseData: any }) => {
    try {
        const {url, headers} = createRequest({ path: DELIVERY_API_URL.CREATE_WAREHOUSE });
        const { payloadMapping } = createWarehouseMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(warehouseData);
        const { data } = await httpPost(url, { body: payload, headers });
        if (!data?.success && !(data?.error?.length && data?.error[0].includes(`${payload.name} already exists`))) {
            throw new Error(JSON.stringify(data));
        }
        return {
            data,
            error: null
        }
    } catch (e) {
        console.log(e);
        return {
            data: null,
            error: e
        }
    }
}

export const updateWarehouse = async ({ warehouseData }: { warehouseData: any }) => {
    try {
        const {url, headers} = createRequest({ path: DELIVERY_API_URL.UPDATE_WAREHOUSE });
        const { payloadMapping } = updateWarehouseMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(warehouseData);
        const { data } = await httpPost(url, { body: payload, responseType: 'text', headers });
        if (!data?.success) {
            throw new Error(JSON.stringify(data));
        }
        return {
            data,
            error: null
        }
    } catch (e) {
        console.log(e);
        return {
            data: null,
            error: e
        }
    }
}

export const createOrder = async ({ orderData }: { orderData: any }) => {
    try {
        const {url, headers} = createRequest({ path: DELIVERY_API_URL.CREATE_ORDER });
        const { payloadMapping } = createOrderMapping;
        const expression = jsonata(payloadMapping);
        const payload = await expression.evaluate(orderData);
        const { data } = await httpPost(url, { body: `format=json&data=${JSON.stringify(payload)}`, headers: { ...headers, 'Content-Type': 'application/text'} });
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
    } catch (error) {
        return {
            data: null,
            orderData: null
        }
    }
}

export const createPickupRequest = async ({ pickupData }: { pickupData: object }) => {
    try {
        const {url, headers} = createRequest({ path: DELIVERY_API_URL.PICKUP_REQUEST });
        const { payloadMapping, responseMapping } = pickupMapping;
        const payload = await mappingEvaluate(payloadMapping, pickupData);
        const { data } = await httpPost(url, { body: payload, headers });
        if (!data.pr_exists) {
            const evaluatedData = await mappingEvaluate(responseMapping, data);
            return { data: evaluatedData, error: null };
``       }
        throw new Error(JSON.stringify(data));
    } catch (e) {
        console.log(e);
        return {
            data: null,
            error: e
        }
    }
}