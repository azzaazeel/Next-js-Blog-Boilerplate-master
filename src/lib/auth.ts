import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  database: new Database('auth.db'),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
});
