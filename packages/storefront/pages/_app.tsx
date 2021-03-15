import { Provider } from "next-auth/client";
import Head from "next/head";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <title>PAYWALL</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
