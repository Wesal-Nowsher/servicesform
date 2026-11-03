import { cookies } from "next/headers";
import { sql, ensureTable } from "@/lib/db";
import { COOKIE, token } from "@/lib/auth";

export const dynamic = "force-dynamic";
const cols = ["id", "created_at", "company_en", "company_ar", "contact", "email", "phone", "mobile", "whatsapp", "emirate", "building", "floor", "office"];
const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  if (!process.env.ADMIN_PASSWORD || cookies().get(COOKIE)?.value !== token()) return new Response("Unauthorized", { status: 401 });
  await ensureTable();
  const rows = await sql()`SELECT * FROM submissions ORDER BY created_at DESC`;
  const head = [...cols, ...Array.from({ length: 10 }, (_, i) => `service_${i + 1}`)];
  const lines = [head.join(","), ...rows.map(r => [...cols.map(c => esc(r[c])), ...Array.from({ length: 10 }, (_, i) => esc((r.services || [])[i]))].join(","))];
  return new Response("﻿" + lines.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="submissions.csv"' } });
}
