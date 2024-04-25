import { addCourierPartners } from "./add-courier-partners.seed";
import { prisma } from "./config";
import { loadAdmin0, loadAdmin1, loadAdmin2, loadPincode } from "./load-admin-list.seed";
import { addRateCard } from "./rate-card.seed";

async function main() {

    await loadAdmin0();
    await loadAdmin1();
    await loadAdmin2();
    await loadPincode();
    await addCourierPartners();
    await addRateCard();
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