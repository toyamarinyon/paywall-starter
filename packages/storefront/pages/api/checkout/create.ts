import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@paywall-content-platform/prisma";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

async function CreateCheckout(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken, productId } = req.body;
  const session = await prisma.session.findUnique({ where: { accessToken } });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  const prices = await stripe.prices.list({ product: product.stripeProductId });
  const price = prices.data[0];
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/checkout/success",
    cancel_url: "http://localhost:3000/back",
    client_reference_id: `${session.userId}`,
  });
  res.json({ id: stripeSession.id });
}

export default CreateCheckout;
