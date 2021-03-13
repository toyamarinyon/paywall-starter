import React from "react";
import useSWR from "swr";
import { signIn, signOut, useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import { Product } from "@paywall-content-platform/prisma";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const fetcher = async function <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  console.log("fetch?");
  const res = await fetch(input, init);
  return res.json();
};

export function Dev({ id }: Product) {
  const [session, loading] = useSession();
  const { data: user, error } = useSWR<{ hasProductToken: boolean }>(
    () =>
      `/api/user/productToken/?userAccessToken=${session.accessToken}&productId=${id}`,
    fetcher
  );
  if (loading) {
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
        productId: id,
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
          {user.hasProductToken ? (
            <span>You're paid user!</span>
          ) : (
            <button onClick={() => onClick()}>Buy Now!</button>
          )}
        </p>
      ) : (
        <p>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </p>
      )}
    </div>
  );
}
