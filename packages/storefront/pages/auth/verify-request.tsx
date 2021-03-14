import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { csrfToken, signIn } from "next-auth/client";
import { Button } from "components/button";
import { SlimLayout } from "components/layout";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      csrfToken: await csrfToken(context),
    },
  };
};
export default function SignIn({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <SlimLayout size="max-w-sm">
      <header className="my-4">
        <h1 className="font-bold text-lg">メールを送信しました</h1>
        <p>
          Eメールに記載されたリンクをクリックしてログインしてください。
        </p>
      </header>
    </SlimLayout>
  );
}
