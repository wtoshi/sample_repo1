import dotenv from 'dotenv';

dotenv.config();

export const config = {
    expiresIn: '7d',
    secret: process.env.JWT_TOKEN as string
  }