import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import nodemailer from "nodemailer";
import { prisma } from "@paywall-content-platform/prisma";
import { html, text } from "mails/auth/verificationRequest";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: 465,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h),
      sendVerificationRequest: ({
        identifier: enteredEmailAddress,
        url,
        token,
        baseUrl,
        provider,
      }) => {
        return new Promise((resolve, reject) => {
          const { server, from } = provider;
          const site = baseUrl.replace(/^https?:\/\//, "");
          nodemailer.createTransport(server).sendMail(
            {
              to: enteredEmailAddress,
              from,
              subject: `Sign in to ${site}`,
              text: text({ url, site, email: enteredEmailAddress }),
              html: html({ url, site, email: enteredEmailAddress }),
            },
            (error) => {
              if (error) {
                return reject(
                  new Error("SEND_VERIFICATION_EMAIL_ERROR")
                );
              }
              return resolve();
            }
          );
        });
      },
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: null, // If set, new users will be directed here on first sign in
  },
};
