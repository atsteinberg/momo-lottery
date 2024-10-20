import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { children } from '../../src/services/db/schema';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

const db = drizzle(pool);

const kids = [
  {name: 'Anna_K'},
  {name: 'Anna_W'},
  {name: 'Arthur'},
  {name: 'Dima'},
  {name: 'Eva'},
  {name: 'Frida_K'},
  {name: 'Frida_S'},
  {name: 'Gabriel'},
  {name: 'Jakob'},
  {name: 'Jona'},
  {name: 'Katharina'},
  {name: 'Ludwig'},
  {name: 'Luzia'},
  {name: 'Mala Luna'},
  {name: 'Marlon'},
  {name: 'Matilda'},
  {name: 'Maximilian'},
  {name: 'Mira'},
  {name: 'Noa'},
  {name: 'Paul'},
  {name: 'Viola'},
  {name: 'Xaver'},
]

const main = async () => {
  await db.insert(children).values(kids)
};

main().catch((err) => {
  console.log('There was an error seeding the database', err);
})
