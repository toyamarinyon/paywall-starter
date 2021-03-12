import { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "@google-cloud/storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
  });

  const bucket = storage.bucket(process.env.BUCKET_NAME);
  const file = bucket.file(req.query.file as string);
  const publicUrl = file.publicUrl();
  res.status(200).json({ publicUrl });
}
