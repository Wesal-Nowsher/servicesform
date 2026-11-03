import { neon } from "@neondatabase/serverless";

export function sql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

let ready = false;
export async function ensureTable() {
  if (ready) return;
  await sql()`CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    company_en TEXT NOT NULL,
    company_ar TEXT,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    mobile TEXT,
    whatsapp TEXT,
    emirate TEXT,
    building TEXT,
    floor TEXT,
    office TEXT,
    services JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  ready = true;
}
