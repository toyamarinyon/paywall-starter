import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@paywall-content-platform/prisma";
import Stripe from "stripe";
import { getSession } from "next-auth/client";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

async function getCustomer(
  userId: number,
  email: string
): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
  console.log(userId);
  const checkoutUserStripeCustomerRelationsCount = await prisma.userStripeCustomerRelation.count(
    {
      where: {
        userId,
      },
    }
  );
  if (checkoutUserStripeCustomerRelationsCount > 0) {
    const userStripeCustomerRelation = await prisma.userStripeCustomerRelation.findFirst(
      {
        where: { userId },
      }
    );
    const customer = await stripe.customers.retrieve(userStripeCustomerRelation.stripeCustomerId);
    return customer;
  }

  const customer = await stripe.customers.create({
    email: email,
  });
  await prisma.userStripeCustomerRelation.create({
    data: {
      userId: userId,
      stripeCustomerId: customer.id,
    },
  });
  return customer;
}

async function CreateInvoice(req: NextApiRequest, res: NextApiResponse) {
  const { productId } = req.body;
  const session = await getSession({ req });
  const dbSession = await prisma.session.findUnique({
    where: { accessToken: session.accessToken },
  });

  const customer = await getCustomer(dbSession.userId, session.user.email);
  console.log(customer);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  const prices = await stripe.prices.list({ product: product.stripeProductId });
  const price = prices.data[0];

  await stripe.invoiceItems.create({
    customer: customer.id,
    price: price.id,
  });

  const invoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: "send_invoice",
    days_until_due: 30,
  });
  const stripeBillingRelation = await prisma.productAccessTokenStripeBillingRelation.create(
    {
      data: {
        collectionMethod: "sendInvoice",
        stripeId: invoice.id,
        billingStatus: "open",
      },
    }
  );
  await prisma.productAccessToken.create({
    data: {
      userId: dbSession.userId,
      productId,
      stripeBillingRelationId: stripeBillingRelation.id,
    },
  });
  await stripe.invoices.finalizeInvoice(invoice.id);
  await stripe.invoices.sendInvoice(invoice.id);

  res.send({ invoice });
}

export default CreateInvoice;
