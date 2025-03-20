import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;

// We must declare the global so TS doesn't complain about `global._mongoClientPromise`
declare global {
  // allow global var as workaround for hot-reloading in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// 1) Either use the existing global promise, or create a new one
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ||
  new MongoClient(uri).connect();

// 2) If in dev, store in the global, so it’s cached across reloads
if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise;
}

// 3) Export the promise for use in other parts of your app
export default clientPromise;