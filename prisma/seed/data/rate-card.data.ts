import { ShippingMode, Zone } from "@prisma/client";

export default [
    {
        name: "Rate card1",
        tags: ['default'],
        userRateCard: [{
            title: "Surface - 0.5 kg to 4 kg Rates",
            mode: ShippingMode.Surface,
            type: 'Forward',
            base: "0.5",
            increment: "0.5", 
            upto: "4",
            rates: [{
                zone: Zone.ZoneA,
                baseRate: "30",
                incrementRate: "29" 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: "33",
                incrementRate: "32" 
              }, {
                zone: Zone.ZoneC,
                baseRate: "46",
                incrementRate: "44" 
              }, {
                zone: Zone.ZoneD,
                baseRate: "54",
                incrementRate: "52" 
              }, {
                zone: Zone.ZoneE,
                baseRate: "64",
                incrementRate: "61" 
              }, {
                zone: Zone.ZoneF,
                baseRate: "75",
                incrementRate: "72" 
              }]
        }, {
            title: "Surface - Upto 5kg to 9 kg Rates",
            mode: ShippingMode.Surface,
            type: 'Forward',
            base: "5",
            increment: "1", 
            upto: "9",
            rates: [{
                zone: Zone.ZoneA,
                baseRate: "163",
                incrementRate: "22" 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: "176",
                incrementRate: "24" 
              }, {
                zone: Zone.ZoneC,
                baseRate: "224",
                incrementRate: "31" 
              }, {
                zone: Zone.ZoneD,
                baseRate: "258",
                incrementRate: "35" 
              }, {
                zone: Zone.ZoneE,
                baseRate: "302",
                incrementRate: "41" 
              }, {
                zone: Zone.ZoneF,
                baseRate: "342",
                incrementRate: "49" 
              }]
        },
        {
          title: "Surface - Upto 10 kg to and above",
          mode: ShippingMode.Surface,
          type: 'Forward',
          base: "10",
          increment: "1", 
          upto: null,
          rates: [{
              zone: Zone.ZoneA,
              baseRate: "226",
              incrementRate: "19" 
            }, 
            {
              zone: Zone.ZoneB,
              baseRate: "245",
              incrementRate: "21" 
            }, {
              zone: Zone.ZoneC,
              baseRate: "311",
              incrementRate: "30" 
            }, {
              zone: Zone.ZoneD,
              baseRate: "359",
              incrementRate: "37" 
            }, {
              zone: Zone.ZoneE,
              baseRate: "419",
              incrementRate: "42" 
            }, {
              zone: Zone.ZoneF,
              baseRate: "484",
              incrementRate: "46" 
            }]
      },
        {
            title: "Base Fare Upto 0.5 kg",
            mode: ShippingMode.Air,
            type: 'Forward',
            base: "0.5",
            increment: "0.5", 
            upto: "4",
            rates: [{
                zone: Zone.ZoneA,
                baseRate: "30",
                incrementRate: "29" 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: "33",
                incrementRate: "32" 
              }, {
                zone: Zone.ZoneC,
                baseRate: "58",
                incrementRate: "55" 
              }, {
                zone: Zone.ZoneD,
                baseRate: "73",
                incrementRate: "69" 
              }, {
                zone: Zone.ZoneE,
                baseRate: "85",
                incrementRate: "80" 
              }, {
                zone: Zone.ZoneF,
                baseRate: "96",
                incrementRate: "91" 
              }]
        }],
    }
]