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
        <h1 className="font-bold text-lg">ログイン</h1>
        <p>ログイン用のリンクをお送りしますので、メールアドレスを入力してください。</p>
      </header>
      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded mb-8"
        />
        <Button text="メール送信" type="submit" />
      </form>
    </SlimLayout>
  );
}
