import { NextApiRequest, NextApiResponse } from "next";
import { Storage } from "@google-cloud/storage";
import crypto from "crypto";

export async function randomString(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (err) {
        reject(err);
      }
      return resolve(buf.toString("hex"));
    });
  });
}

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

  const filename = await randomString();
  const bucket = storage.bucket(process.env.BUCKET_NAME);
  const file = bucket.file(filename);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: { "x-goog-meta-test": "data" },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);
  res.status(200).json(response);
}
