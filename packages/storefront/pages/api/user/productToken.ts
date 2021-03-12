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
  res.send({ hasProductToken: productAccessToken });
}

export default ProductToken;
