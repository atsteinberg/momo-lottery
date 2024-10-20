import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

console.log('db url', process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default drizzle(pool);