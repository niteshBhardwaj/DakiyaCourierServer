import { ApiConfig, CourierPartner, PincodeAvailability } from "@prisma/client"
import { createCourierPartnerRequest } from "./courier-partner.util"
import { badRequestException } from "./exceptions.util";
import jsonata from "jsonata";
import deliveryPincode from "../../prisma/seed/data/delivery-pincode";

export const getPincodeFromService = async (courierApiConfig: ApiConfig & { courierPartner: CourierPartner }): Promise<PincodeAvailability[] | null> => {   
    try {
        const { responseMapper } = courierApiConfig;
        const { mapping, afterResultRunner } = responseMapper || {};
        let data = deliveryPincode;//await createCourierPartnerRequest(courierApiConfig);
        if(afterResultRunner) {
            data = eval(afterResultRunner)
        }
        const expression = jsonata(mapping as string);
        const result = await expression.evaluate(data, courierApiConfig);
        return result as PincodeAvailability[];
    } catch(e) {
        console.log(e);
        throw badRequestException(`Failed to load pincode`);
    }
}