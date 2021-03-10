import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { prisma, Product } from "@paywall-content-platform/prisma";

export const getStaticProps: GetStaticProps<{ products: Product[] }> = async () => {
  const products = await prisma.product.findMany();
  return { props: { products } };
};

function ProductIndex({ products }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>loading...</div>;
  }
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ProductIndex;
