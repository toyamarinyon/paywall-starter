import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { prisma, User } from "@paywall-content-platform/prisma";

export const getStaticProps: GetStaticProps<{ users: User[] }> = async () => {
  const users = await prisma.user.findMany();
  return { props: { users } };
};

function UserIndex({ users }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.id}`}>{user.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default UserIndex;
