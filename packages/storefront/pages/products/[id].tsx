import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import { prisma, Product } from "@paywall-content-platform/prisma";

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<{ product: Product }> = async ({
  params,
}) => {
  const id = parseInt(params.id as string);
  const product = await prisma.product.findFirst({ where: { id } });
  return { props: { product } };
};

function ProductDetail({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [session, loading] = useSession();
  const router = useRouter();
  if (router.isFallback || loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      {session ? (
        <p>Signed in as {session.user.email}</p>
      ) : (
        <p>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </p>
      )}
      <p>ヤッホー！{product.name}</p>
    </div>
  );
}

export default ProductDetail;
