import { ApiConfig, AuthSecretType, CourierPartner } from "@prisma/client";
import deliveryPincode from '../../prisma/seed/data/delivery-pincode'

const createAuthSecret = (authConfig: any) => {
    const { type, keyName, value } = authConfig;
    let queryString = ''
    let authHeaders = null;
    if (type === AuthSecretType.QUERY) {
        queryString = `${keyName}=${value}`
    } else if (type === AuthSecretType.BEARER) {
        authHeaders = {
            [keyName]: `Bearer ${value}`
        }
    }
    return {
        queryString,
        authHeaders
    }
}

export const createCourierPartnerRequest = async (courierApiConfig: ApiConfig & { courierPartner: CourierPartner }) => {
    const { courierPartner, endpoint, method } = courierApiConfig;
    const { authConfig, host } = courierPartner;
    const isGet = method.toUpperCase() === 'GET'
    const { queryString, authHeaders } = createAuthSecret(authConfig);
    const url = `${host}${endpoint}?${queryString}`;
    console.log(url, method, queryString, authHeaders)
    try {
        const request = await fetch(url, {
            method,
            headers: {
                ...authHeaders
            }
        })
        if(isGet) {
            const json = await request.json();
            return json
        }
        return request;
    } catch (error) {
        console.log(error);
        throw error;
    }
}