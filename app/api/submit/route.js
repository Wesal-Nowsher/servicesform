import { sql, ensureTable } from "@/lib/db";

const s = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  const d = {
    company_en: s(b.company_en), company_ar: s(b.company_ar), contact: s(b.contact), email: s(b.email),
    phone: s(b.phone, 40), mobile: s(b.mobile, 40), whatsapp: s(b.whatsapp, 40),
    emirate: s(b.emirate, 40), building: s(b.building), floor: s(b.floor, 20), office: s(b.office, 20),
  };
  const services = (Array.isArray(b.services) ? b.services : []).map(x => s(x)).filter(Boolean).slice(0, 10);
  if (!d.company_en || !d.contact || !d.email) return Response.json({ error: "Please fill in the required fields." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return Response.json({ error: "Please enter a valid e-mail." }, { status: 400 });
  try {
    await ensureTable();
    await sql()`INSERT INTO submissions (company_en, company_ar, contact, email, phone, mobile, whatsapp, emirate, building, floor, office, services)
      VALUES (${d.company_en}, ${d.company_ar}, ${d.contact}, ${d.email}, ${d.phone}, ${d.mobile}, ${d.whatsapp}, ${d.emirate}, ${d.building}, ${d.floor}, ${d.office}, ${JSON.stringify(services)})`;
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Could not save your submission. Please try again." }, { status: 500 });
  }
}
