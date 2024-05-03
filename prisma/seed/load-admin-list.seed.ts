import pincodeList from './data/pincode-list.data'
import pincodeAreaList from './data/pincode.area.list.data'
import admin0List from './data/admin0-list.data'
import admin1List from './data/admin1-list.data'
import admin2List from './data/admin2-list.data'
import { prisma } from './util';


export async function loadAdmin0() {
  
  const countryCount = await prisma.country.count();
  console.log('country count found', countryCount)

  if(countryCount < 1) {
    const countryAdded = await prisma.country.createMany({
      data: admin0List
    })
    console.log('added country list', countryAdded.count)
  }
}

export async function loadAdmin1() {
  
  const admin1Count = await prisma.admin1.count();
  console.log('admin1 count found', admin1Count)

  if(admin1Count < 1) {
    const admin1Added = await prisma.admin1.createMany({
      data: admin1List
    })
    console.log('added admin1 list', admin1Added.count)
  }
}

export async function loadAdmin2() {
  
  const admin2Count = await prisma.admin2.count();
  console.log('admin2 count found', admin2Count)

  if(admin2Count < 1) {
    const admin2Added = await prisma.admin2.createMany({
      data: admin2List
    })
    console.log('added admin2 list', admin2Added.count)
  }
}

export async function loadPincode() {
  
    const pincodeCount = await prisma.pincode.count();
    const areaListCount = await prisma.area.count();
    console.log('pincode count found', pincodeCount)
    console.log('area list count found', areaListCount)

    if(pincodeCount < 1) {
      const pincodeAdded = await prisma.pincode.createMany({
        data: pincodeList
      })
      console.log('added pincode list', pincodeAdded.count)
    }

    if(areaListCount < 1) {
      const areaList = await prisma.area.createMany({
        data: pincodeAreaList
      })
      console.log('added areaList list', areaList.count)
    }

}
