import type { Config } from 'drizzle-kit';
import { config } from './src/db/client';

export default {
  dialect: 'turso',
  schema: './src/db/schema/*',
  out: './drizzle',
  dbCredentials: config,
} satisfies Config;
