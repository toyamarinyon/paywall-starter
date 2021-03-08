import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { prisma, User } from "@paywall-content-platform/prisma";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<{ user: User }> = async ({
  params,
}) => {
  const id = parseInt(params.id as string);
  const user = await prisma.user.findFirst({ where: { id } });
  return { props: { user } };
};

function UserDetail({ user }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  return <p>ヤッホー！{user.name}</p>;
}

export default UserDetail;
