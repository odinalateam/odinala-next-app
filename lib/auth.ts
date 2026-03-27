import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { sendEmail, APP_URL } from "@/lib/email";
import { WelcomeEmail } from "@/emails/welcome";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          sendEmail({
            to: user.email,
            subject: "Welcome to Odinala",
            react: WelcomeEmail({
              userName: user.name,
              appUrl: APP_URL,
            }),
          });
        },
      },
    },
  },

  plugins: [admin(), nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
