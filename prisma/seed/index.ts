import { PrismaClient } from '@prisma/client'
import pincodeList from './pincode-list'
import pincodeAreaList from './pincode.area.list'
const prisma = new PrismaClient()
async function main() {
  
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
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })