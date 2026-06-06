import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db } from "mongodb";
if (!db) {
  throw new Error("Database not connected");
}

const authBaseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL;

const trustedOrigins = [
  authBaseURL,
  process.env.NEXT_PUBLIC_APP_URL,
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  baseURL: authBaseURL,
  trustedOrigins,
  database: mongodbAdapter(db as unknown as Db),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
  },
  hooks: {
    before: createAuthMiddleware(async () => {}),
  },
  account: {},
  plugins: [admin(), nextCookies()],
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          console.log("session create", session);
        },
      },
    },
    user: {
      update: {
        before: async (session) => {
          console.log("session update before", session, session);
        },
        after: async (session) => {
          console.log("session update after", session);
        },
      },
    },
  },
});
export type UserSession = typeof auth.$Infer.Session;
export type User = UserSession["user"];
export type Session = UserSession["session"];
