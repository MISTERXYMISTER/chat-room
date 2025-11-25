import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient | null>;

if (!uri) {
  console.warn('MONGODB_URI not found. Using in-memory storage.');
  clientPromise = Promise.resolve(null);
} else {
  if (process.env.NODE_ENV === 'development') {
    const globalWithMongo = global as typeof global & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise.catch(err => {
        console.error("MongoDB connection failed:", err);
        return null;
    });
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch(err => {
        console.error("MongoDB connection failed:", err);
        return null;
    });
  }
}

export default clientPromise;
