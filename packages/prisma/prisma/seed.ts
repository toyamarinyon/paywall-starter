import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const serverlessEcGuide = await prisma.product.upsert({
    where: { id: 1 },
    update: {
      coverUrl: "https://storage.googleapis.com/my-bucket-c7c5403%2F772d45d9b3635ac8f9c6f6faf28db8a6af552460",
      stripeProductId: "prod_J7IHfjgFnsYIte",
    },
    create: {
      name: "VercelとPrismaで作るサーバレスEC作成ガイド",
      description: "つまづきやすいところを説明します",
      amount: 1200,
      coverUrl: "https://storage.googleapis.com/my-bucket-c7c5403%2F772d45d9b3635ac8f9c6f6faf28db8a6af552460",
      stripeProductId: "prod_J7IHfjgFnsYIte",
      productType: "classic",
    },
  });
  const desk = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "デスクの説明",
      description: "デスクに置いているものの説明をします",
      amount: 200,
      coverUrl: "https://storage.googleapis.com/my-bucket-c7c5403%2F492c0a1b2c6a96d5bf48b3fcd6eecbfdb1a842fe",
      stripeProductId: "prod_J7J2JQUOfHrx5b",
      productType: "classic",
    },
  });
  console.log(serverlessEcGuide, desk);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
