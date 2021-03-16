import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@paywall-content-platform/prisma";

async function ProductToken(req: NextApiRequest, res: NextApiResponse) {
  const { userAccessToken, productId } = req.query;
  const session = await prisma.session.findUnique({
    where: { accessToken: userAccessToken as string },
  });
  const productAccessToken = await prisma.productAccessToken.findUnique({
    where: {
      userId_productId: {
        userId: session.userId,
        productId: parseInt(productId as string),
      },
    },
  });
  if (!productAccessToken) {
    res.status(404).send({});
    return;
  }
  const billingRelation = await prisma.productAccessTokenStripeBillingRelation.findUnique(
    {
      where: {
        id: productAccessToken.stripeBillingRelationId,
      },
    }
  );
  res.send({
    hasProductToken: productAccessToken ? true : false,
    billingStatus: billingRelation.billingStatus,
  });
}

export default ProductToken;
