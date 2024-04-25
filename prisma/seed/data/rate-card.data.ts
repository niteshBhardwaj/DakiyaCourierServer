import { ShippingMode, Zone } from "@prisma/client";

export default [
    {
        name: "Rate card1",
        tags: ['default'],
        userRateCard: [{
            title: "Surface - 500 g to 4 kg Rates",
            mode: ShippingMode.Surface,
            type: 'Forward',
            base: 0.5,
            increment: 0.5, 
            upto: 4,
            rates: [{
                zone: Zone.ZoneA,
                baseRate: 30,
                incrementRate: 29 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: 33,
                incrementRate: 32 
              }, {
                zone: Zone.ZoneC,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneD,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneE,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneF,
                baseRate: 30,
                incrementRate: 29 
              }]
        }, {
            title: "Surface - 500 g to 4 kg Rates",
            mode: ShippingMode.Surface,
            type: 'Forward',
            base: 5,
            increment: 1, 
            upto: null,
            rates: [{
                zone: Zone.ZoneA,
                baseRate: 30,
                incrementRate: 29 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: 33,
                incrementRate: 32 
              }, {
                zone: Zone.ZoneC,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneD,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneE,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneF,
                baseRate: 30,
                incrementRate: 29 
              }]
        }, {
            title: "Base Fare (upto 500 g)",
            mode: ShippingMode.Air,
            type: 'Forward',
            base: 0.5,
            increment: 0.5, 
            upto: 4,
            rates: [{
                zone: Zone.ZoneA,
                baseRate: 30,
                incrementRate: 29 
              }, 
              {
                zone: Zone.ZoneB,
                baseRate: 33,
                incrementRate: 32 
              }, {
                zone: Zone.ZoneC,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneD,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneE,
                baseRate: 30,
                incrementRate: 29 
              }, {
                zone: Zone.ZoneF,
                baseRate: 30,
                incrementRate: 29 
              }]
        }],
    }
]