import { Order } from "@prisma/client";

export type TrackingRecieveType = {
    waybill: string;
    expectedDeliveryDate: string | null;
    firstAttemptDate: string | null;
    promisedDeliveryDate: string | null;
    outDestinationDate: string | null;
    rtoStartDate: string | null;
    destinationRecieveDate: string | null;
    reverseInTransit: boolean;
    scans: Array<{
        dateTime: string;
        location: string;
        type: string;
        status: string;
        instructions: string;
    }>;
}

export type GetTrackingType = Pick<Order, "id" | "waybill"> & { lastStatusDateTime: Date; lastChecked: Date };
