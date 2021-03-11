import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { prisma } from "@paywall-content-platform/prisma";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;
const webhookSecret: string = "whsec_HY94DE2G47qKAve1oYrXvuKzrbrubMmO";
async function CheckoutWebhook(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers["stripe-signature"];

  // StripeのドキュメントにはbodyParser.raw({type: 'application/json'})するように書いてあるが、
  // nextjsで指定できないので、
  // https://codedaily.io/tutorials/183/Stripe-Webhook-Verification-with-NextJS を参考に、
  // bufferに変換
  const buf = await buffer(req);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Cast event data to Stripe object
  if (event.type === "payment_intent.succeeded") {
    const stripeObject: Stripe.PaymentIntent = event.data
      .object as Stripe.PaymentIntent;
    console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
  } else if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    console.log(`💵 Charge id: ${charge.id}`);
  } else if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    console.log(`💵 CheckoutSession id: ${checkoutSession.id}`);
    const checkoutSessionLineItems = await stripe.checkout.sessions.listLineItems(
      checkoutSession.id
    );
    const lineItem = checkoutSessionLineItems.data[0];
    const product = await prisma.product.findUnique({
      where: {
        stripeProductId: lineItem.price.product.toString(),
      },
    });
    await prisma.productAccessToken.create({
      data: {
        productId: product.id,
        userId: parseInt(checkoutSession.client_reference_id),
      },
    });
  } else {
    console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }
  res.send(200);
}

export default CheckoutWebhook;
