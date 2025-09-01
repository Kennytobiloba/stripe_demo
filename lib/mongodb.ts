import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  // Create a custom type for the cached mongoose connection
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Use a separate global key to avoid name/type collision
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    } catch (err: any) {
      console.error("Failed to start MongoDB connection:", err.message);
      throw new Error("Initial connection error");
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    console.error("MongoDB connection promise rejected:", err.message);
    throw new Error("MongoDB connection failed");
  }

  return cached.conn;
}
