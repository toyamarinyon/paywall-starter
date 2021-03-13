import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@paywall-content-platform/prisma";
import Stripe from "stripe";
import path from "path";
import { getSession } from "next-auth/client";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

async function CreateCheckout(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.body;
  const session = await getSession({ req });
  const dbSession = await prisma.session.findUnique({
    where: { accessToken: session.accessToken },
  });
  const product = await prisma.product.findUnique({ where: { id: productId } });
  const prices = await stripe.prices.list({ product: product.stripeProductId });
  const price = prices.data[0];
  const protocol = process.env["NODE_ENV"] === "development" ? "http" : "https";
  const url = path.join(process.env["HOST"], "/products", `${productId}`);
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${protocol}://${url}`,
    cancel_url: `${protocol}://${url}`,
    client_reference_id: `${dbSession.userId}`,
    customer_email: session.user.email,
  });
  res.json({ id: stripeSession.id });
}

export default CreateCheckout;
