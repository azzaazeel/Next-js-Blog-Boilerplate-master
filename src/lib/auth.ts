import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

const baseURL = (process.env.BETTER_AUTH_URL || 'http://localhost:3000').replace(/\/$/, '');

export const auth = betterAuth({
  database: new Database('auth.db'),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    baseURL,
    'http://localhost:3000',
    'https://kanocs.com',
    'https://www.kanocs.com'
  ],
});
