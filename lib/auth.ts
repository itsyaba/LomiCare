import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db } from "mongodb";
if (!db) {
  throw new Error("Database not connected");
}

function normalizeURL(url?: string) {
  if (!url) {
    return undefined;
  }

  const value = url.trim();
  if (!value) {
    return undefined;
  }

  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

const authBaseURL = normalizeURL(
  process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL,
);

const trustedOrigins = [
  authBaseURL,
  process.env.NEXT_PUBLIC_APP_URL,
  normalizeURL(process.env.VERCEL_URL),
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
]
  .map((origin) => normalizeURL(origin))
  .filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  baseURL: authBaseURL,
  trustedOrigins: [...new Set(trustedOrigins)],
  database: mongodbAdapter(db as unknown as Db),
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
  },
  account: {},
  plugins: [admin(), nextCookies()],
});
export type UserSession = typeof auth.$Infer.Session;
export type User = UserSession["user"];
export type Session = UserSession["session"];
