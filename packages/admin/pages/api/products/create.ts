import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { prisma, ProductType } from "@paywall-content-platform/prisma";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

async function CreateProduct(req: NextApiRequest, res: NextApiResponse) {
  const { name, amount } = req.body;
  const stripeProduct = await stripe.products.create({
    name,
  });
  await stripe.prices.create({
    product: stripeProduct.id,
    unit_amount: amount,
    currency: "jpy",
  });
  const product = await prisma.product.create({
    data: {
      name,
      amount: parseInt(amount), // 自動でキャストはしてくれない
      stripeProductId: stripeProduct.id,
      productType: ProductType.classic,
    },
  });
  return res.send({ product });
}

export default CreateProduct;
