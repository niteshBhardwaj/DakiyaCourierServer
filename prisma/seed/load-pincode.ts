import pincodeList from './data/pincode-list'
import pincodeAreaList from './data/pincode.area.list'
import { prisma } from './config';

export async function loadPincode() {
  
    const pincodeCount = await prisma.pincodeList.count();
    const areaListCount = await prisma.area.count();
    console.log('pincode count found', pincodeCount)
    console.log('area list count found', areaListCount)

    if(pincodeCount < 1) {
      const pincodeAdded = await prisma.pincodeList.createMany({
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
