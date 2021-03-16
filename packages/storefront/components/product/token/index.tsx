import React, { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";

import { Product } from ".prisma/client";
import { Button } from "components/button";
import { useProductToken } from "data/product/use-token";
import Link from "next/link";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export function ProductToken(product: Product) {
  const [click, setClick] = useState(false);
  const { loading, hasProductToken, billingStatus } = useProductToken(product);
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
        <p className="text-gray-500 test-sm text-center">
          外部の決済サイトに遷移します。
        </p>
        <div className="relative">
          <hr className="my-6" />
          <div className="absolute flex justify-center items-center w-full h-full top-0">
            <span className="px-2 bg-white text-sm text-gray-400">
              もしくは
            </span>
          </div>
        </div>

        <Link href={`/bank-transfer/form?productId=${product.id}`}>
          <a
            className="text-blue-500 text-center block"
            // onClick={() => {
            //   fetch("/api/invoices/create", {
            //     method: "POST",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //       productId: product.id,
            //     }),
            //   });
            // }}
          >
            銀行振り込みでのお支払いをご希望の方はこちら
          </a>
        </Link>
      </>
    );
  }
  if (billingStatus === "open") {
    return <p>銀行振り込みの連絡をお待ちしています。</p>;
  }

  return (
    <div>
      <p>ご購入ありがとうございました！</p>
    </div>
  );
}
