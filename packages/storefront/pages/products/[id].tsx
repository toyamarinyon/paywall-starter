import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { prisma, Product } from "@paywall-content-platform/prisma";
import { SlimLayout } from "components/layout";
import { Dev } from "components/product/token/Dev";
import Image from "next/image";

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
  const router = useRouter();
  if (router.isFallback) {
    return <div>loading...</div>;
  }

  return (
    <SlimLayout>
      <div>
        <Dev {...product} />
        <div className="relative h-48">
          <Image src={product.coverUrl} layout="fill" />
        </div>
        <header>
          <h1 className="font-bold text-lg">{product.name}</h1>
        </header>
        <article>
          <p>{product.description}</p>

        </article>
      </div>
    </SlimLayout>
  );
}

export default ProductDetail;
