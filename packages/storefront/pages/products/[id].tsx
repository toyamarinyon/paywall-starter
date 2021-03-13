import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import { prisma, Product } from "@paywall-content-platform/prisma";
import { SlimLayout } from "components/layout";
import { ProductToken } from "components/product/token";

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

function numberToJpyFormat(number: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  }).format(number);
}

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
        <div className="relative h-96">
          <Image src={product.coverUrl} layout="fill" objectFit="contain" />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <section className="mb-4">
            <header>
              <h1 className="font-bold text-lg">{product.name}</h1>
            </header>
            <article>
              <p>{product.description}</p>
            </article>
          </section>
          <section className="w-full md:w-72">
            <div className="bg-white p-4 border shadow-sm">
              <p className="mb-1 text-xl font-bold">
                {numberToJpyFormat(product.amount)}
              </p>
              <ProductToken {...product} />
            </div>
          </section>
        </div>
      </div>
    </SlimLayout>
  );
}

export default ProductDetail;
