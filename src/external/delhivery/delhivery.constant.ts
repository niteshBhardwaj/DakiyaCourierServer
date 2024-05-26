
export const DELIVERY_API_URL = {
    PINCODE_SERVICEABILITY: "/c/api/pin-codes/json", //?filter_codes=110042
    CREATE_ORDER: "/api/cmu/create.json",
    EDIT_ORDER: "/api/p/edit",
    TRACKING: "/api/v1/packages/json", //?waybill=
    CALCULATE_SHIPMENT: "/api/kinko/v1/invoice/charges/.json",  //?parameter
    GENERATE_SHIPPING_LABEL: "/api/p/packing_slip", //?wbns=waybill&pdf=true
    PICKUP_REQUEST: "/​fm/request/new",
    CREATE_WAREHOUSE: "/api/backend/clientwarehouse/create",
    UPDATE_WAREHOUSE: "/api/backend/clientwarehouse/edit",
    NDR_ACTION: "/api/p/update",
}