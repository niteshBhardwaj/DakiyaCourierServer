import { addApiConfig, addCourierPartners } from "./add-courier-partners";
import { prisma } from "./config";
import { loadPincode } from "./load-pincode";

async function main() {

    await loadPincode();
    await addCourierPartners();
    await addApiConfig();
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