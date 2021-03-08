import { prisma } from "./index";

async function main() {
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Tom",
  //     email: "toyamarinyon@gmail.com",
  //   },
  // });
  // console.log(user);
  const users = await prisma.user.findMany()
  console.log(users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
