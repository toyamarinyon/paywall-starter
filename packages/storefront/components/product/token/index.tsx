import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";

import { Product } from ".prisma/client";
import { Button } from "components/button";
import { useProductToken } from "data/product/use-token";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);


export function ProductToken(product: Product) {
  const [click, setClick] = useState(false);
  const { loading, hasProductToken } = useProductToken(product);
  const [session] = useSession();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!session) {
    return <Button onClick={() => signIn()} />;
  }
  if (!hasProductToken) {
    const onClick = async () => {
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
    };
    return (
      <>
        <Button
          loading={click}
          onClick={() => {
            if (click) {
              return;
            }
            setClick(true);
            onClick();
          }}
          className="mb-2"
        />
        <p className="text-gray-500 test-sm">外部の決済サイトに遷移します。</p>
      </>
    );
  }

  return (
    <div>
      <p>ご購入ありがとうございました！</p>
    </div>
  );
}
