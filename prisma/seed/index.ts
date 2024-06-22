import { addCourierPartners } from "./add-courier-partners.seed";
import { addConfig } from "./app-config.seed";
import { loadAdmin0, loadAdmin1, loadAdmin2, loadPincode } from "./load-admin-list.seed";
import { addRateCard } from "./rate-card.seed";
import { prisma } from "./util";

async function main() {

    await addConfig();
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
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })