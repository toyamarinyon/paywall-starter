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
        <h1 className="font-bold text-lg">会員登録・ログイン</h1>
        <p>
          入力いただいたメールアドレスにメールを送りましたのでご確認ください。
        </p>
      </header>
    </SlimLayout>
  );
}
