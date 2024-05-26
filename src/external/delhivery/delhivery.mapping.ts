
export const pincodeServiceabilityMapping = {
    response: `$map($filter(delivery_codes, function($v) {
            $v.postal_code.country_code = "IN"
        }), function($item) {
            {
            "isPrepaid": $item.postal_code.pre_paid = "Y" ? true : false,
            "isCash": $item.postal_code.cash = "Y" ? true : false,
            "isCod": $item.postal_code.cod = "Y" ? true : false,
            "isOda": $item.postal_code.is_oda = "Y" ? true : false,
            "maxWeight": $item.postal_code.max_weight,
            "maxAmount": $item.postal_code.max_amount,
            "remarks": $item.remarks,
            "pincode": $item.postal_code.pin,
            "center": $item.postal_code.center,
            "courierId": $courierId
            }
        })`
}

export const createWarehouseMapping = {
    payloadMapping: `{
        "phone": phone,
        "city": city,
        "name": pickupId,
        "pin": $string(pincode),
        "address": address,
        "country": country,
        "email": email,
        "registered_name": name,
        "return_address": returnAddress ? returnAddress.address : address,
        "return_pin": $string(returnAddress ? returnAddress.pincode : pincode),
        "return_city": returnAddress ? returnAddress.city : city,
        "return_state": returnAddress ? returnAddress.state: state,
        "return_country": returnAddress ? returnAddress.country : country
    }`
}

export const updateWarehouseMapping = {
    payloadMapping: `{
        "phone": phone,
        "city": city,
        "name": pickupId,
        "pin": pincode,
        "address": address,
        "country": country,
        "email": email,
        "registered_name": name,
        "return_address": returnAddress.address,
        "return_pin": returnAddress.pincode,
        "return_city": returnAddress.city,
        "return_state": returnAddress.state,
        "return_country": returnAddress.country
    }`
}

export const createOrderMapping = {
    payloadMapping: `{
    "shipments": [
        {
            "add": dropAddress.address,
            "phone": dropAddress.phone,
            "payment_mode": paymentMode,
            "name": dropAddress.name,
            "pin": dropAddress.pincode,
            "state": dropAddress.state,
            "city": dropAddress.city,
            "order": orderId,
            "shipping_mode": shippingMode,
            "weight": weight,
            "od_distance": "",
            "fragile_shipment": isFragile,
            "shipment_height": boxHeight,
            "shipment_length": boxLength,
            "shipment_width": boxWidth,
            "category_of_goods": "",
            "cod_amount": codAmount,
            "return_city": pickupAddress.returnAddress.address,
            "return_phone": pickupAddress.phone,
            "return_state": pickupAddress.returnAddress.state,
            "return_country": pickupAddress.returnAddress.country,
            "return_add": pickupAddress.returnAddress.address,
            "dangerous_good": "false",
            "order_date": "",
            "total_amount": totalAmount,
            "seller_add": dropAddress.address,
            "country": dropAddress.country,
            "return_pin": pickupAddress.returnAddress.pincode,
            "return_name": pickupAddress.name
        }
        ],
        "pickup_location": {
            "name": pickupAddress.pickupId,
            "city": pickupAddress.city,
            "pin": pickupAddress.pincode,
            "country": pickupAddress.country,
            "phone": pickupAddress.phone,
            "add": pickupAddress.address
        }
    }`
}
export const pickupMapping = {
    payloadMapping: `{
        "pickup_time": pickupTime,
        "pickup_date": pickupDate,
        "pickup_location": pickupLocation,
        "expected_package_count": packageCount
    }`,
    responseMapping: `{
        "incomingCenter": incoming_center_name,
        "pickupTime": pickup_time,
        "pickupDate": pickup_date,
        "pickupId": pickup_id,
        "packageCount": package_count
    }`
}

export const trackingMapping = {
    responseMapping: `$map(ShipmentData, function($item) {
        {
            "waybill": $item.Shipment.AWB,
            "expectedDeliveryDate": $item.Shipment.ExpectedDeliveryDate,
            "firstAttemptDate": $item.Shipment.FirstAttemptDate,
            "promisedDeliveryDate": $item.Shipment.PromisedDeliveryDate,
            "outDestinationDate": $item.Shipment.OutDestinationDate,
            "rtoStartDate": $item.Shipment.RTOStartedDate,
            "destinationRecieveDate": $item.Shipment.DestRecieveDate,
            "ReverseInTransit": $item.Shipment.ReverseInTransit,
            "scans": $map($item.Shipment.Scans, function($scan) {
                {
                    "dateTime": $scan.ScanDetail.ScanDateTime,
                    "location": $scan.ScanDetail.ScannedLocation,
                    "type": $scan.ScanDetail.ScanType,
                    "status": $scan.ScanDetail.Scan,
                    "instructions": $scan.ScanDetail.Instructions
                }
            })
        }
        })`
}