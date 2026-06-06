import mongoose from "mongoose";
import type { Db } from "mongodb";

type dbCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const mongoGlobal = global as typeof globalThis & {
  mongoose: dbCache;
};

const MONGODB_URI = (process.env.MONGODB_URI ||
  process.env.DATABASE_URL) as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI or DATABASE_URL environment variable",
  );
}

const cached = mongoGlobal.mongoose ?? { conn: null, promise: null };
mongoGlobal.mongoose = cached;
export async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
const conn = await dbConnect();
if (!conn.connection.db) {
  throw new Error("MongoDB database connection was not initialized");
}

const db = conn.connection.db as unknown as Db;
export { db };
