import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO;
    if (!mongoURI) {
      throw new Error('MONGO environment variable is not set');
    }
    await mongoose.connect(mongoURI);
    console.log('Connected to DB!');
  } catch (err : any) {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1); // Application will exit with a failure code
  }
};