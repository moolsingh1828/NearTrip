import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    console.log('[db] MONGODB_URI not set; share persistence is disabled.');
    return false;
  }
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('[db] MongoDB connected');
    return true;
  } catch (error) {
    console.warn('[db] MongoDB unavailable; continuing without persistence:', error.message);
    return false;
  }
}
