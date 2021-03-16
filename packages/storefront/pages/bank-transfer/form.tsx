import { prisma, Product } from "@paywall-content-platform/prisma";
import { useRouter } from "next/router";
import { Button } from "components/button";
import { SlimLayout } from "components/layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";

function FlowPanel({
  title,
  number,
  children,
  icon,
}: {
  title: string;
  number: number;
  children: React.ReactElement;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex md:flex-col space-x-4 md:space-x-0 md:space-y-2 justify-center md:justify-start">
      <div className="hidden md:block">
        <span className="border border-blue-600 rounded-full text-blue-600 px-2 font-bold text-sm">
          STEP {number}
        </span>
      </div>

      <div>
        <figure className="w-24 h-24 bg-blue-100 rounded-full p-4">
          {icon}
        </figure>
      </div>
      <div>
        <header className="font-bold w-full">
          <span className="border border-blue-600 rounded-full text-blue-600 px-2 font-bold text-sm md:hidden">
            STEP {number}
          </span>
          <h2 className="text-lg text-gray-700">{title}</h2>
        </header>
        <section className="">{children}</section>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  product: Product;
}> = async (context) => {
  const { productId } = context.query;

  if (!productId) {
    return {
      props: {},
      notFound: true,
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId as string) },
  });
  if (!product) {
    return {
      props: {},
      notFound: true,
    };
  }
  return {
    props: {
      product,
    },
  };
};

export default function BankTransferForm({
  product,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  return (
    <SlimLayout>
      <header className="mb-2">
        <h1 className="text-xl font-bold">銀行振り込みのご案内</h1>
      </header>
      <section className="mb-8">
        <p className="mt-4 my-8">
          参加費を銀行振り込みでお支払いいただく場合、参加登録が完了するまで時間がかかりますので、ご了承ください。
          <br />
          具体的には以下の通りです。
        </p>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-4 relative">
          <FlowPanel
            title="振り込み手続きを開始"
            number={1}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
          >
            <p className="text-sm">
              このページの下の「振り込み手続きを開始する」を押してください。
            </p>
          </FlowPanel>
          <FlowPanel
            title="メールを確認"
            number={2}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          >
            <>
              <p className="text-sm mb-2">
                ご登録いただいているメールアドレスに請求書をお送りします。
              </p>
              <p className="text-xs">
                手続き開始後、1時間経っても届かない場合はお手数ですが事務局にご連絡ください。
              </p>
            </>
          </FlowPanel>
          <FlowPanel
            title="銀行振り込み"
            number={3}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          >
            <p className="text-sm">
              請求書に記載されている振込先に参加費をお振り込みください
            </p>
          </FlowPanel>
          <FlowPanel
            title="振り込み完了を連絡"
            number={4}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            }
          >
            <p className="text-sm">
              事務局に振り込み完了した旨をご連絡ください。振り込みが確認できたら参加登録を完了します。
            </p>
          </FlowPanel>
        </div>
      </section>
      <section className="max-w-md mx-auto my-12">
        <div className="rounded border border-red-500">
          <header className="border-b border-red-500 flex justify-center items-center py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 mr-1 text-red-600"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-bold">ご注意事項</span>
          </header>
          <section className="px-4 py-2">
            参加費を前日や当日にお振り込みいただいた場合、振り込みを確認できず、参加いただけない場合があります。
          </section>
        </div>
      </section>
      <section className="flex justify-center mb-24 max-w-md mx-auto">
        <Button
          className="rounded bg-indigo-500 text-white px-8 py-4 text-xl"
          text="上記に同意して振り込み手続きを開始する"
          onClick={async () => {
            if (submitting) {
              return;
            }
            setSubmitting(true);
            await fetch("/api/invoices/create", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productId: product.id,
              }),
            });

            router.push(`/products/${product.id}`);
          }}
          loading={submitting}
        />
      </section>
    </SlimLayout>
  );
}
