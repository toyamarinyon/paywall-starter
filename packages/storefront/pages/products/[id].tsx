import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import { prisma, Product } from "@paywall-content-platform/prisma";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

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
  async function onClick() {
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await fetch("/api/checkout/create", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        accessToken: session.accessToken,
        productId: product.id,
      }),
    });

    const stripeSession = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: stripeSession.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  }
  return (
    <div>
      {session ? (
        <p>
          Signed in as {session.user.email}
          <br />
          <button onClick={() => onClick()}>Buy Now!</button>
        </p>
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
