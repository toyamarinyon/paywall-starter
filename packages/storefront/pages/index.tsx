import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { BaseLayout } from "components/layout";
import { prisma, Product } from "@paywall-content-platform/prisma";
import { ProductListItem } from "components/product/ListItem";
export const getStaticProps: GetStaticProps<{
  products: Product[];
}> = async () => {
  const products = await prisma.product.findMany();
  return { props: { products } };
};

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  return (
    <BaseLayout>
      <div className="flex space-x-4">
        {products.map((product) => (
          <ProductListItem {...product} key={product.id} />
        ))}
      </div>
    </BaseLayout>
  );
}
