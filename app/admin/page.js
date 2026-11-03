import { cookies } from "next/headers";
import { sql, ensureTable } from "@/lib/db";
import { COOKIE, token } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Submissions Admin" };

export default async function Admin({ searchParams }) {
  const authed = process.env.ADMIN_PASSWORD && cookies().get(COOKIE)?.value === token();
  if (!authed) return (
    <main className="wrap" style={{ maxWidth: 420 }}>
      <form className="card" method="post" action="/api/login" style={{ marginTop: 60 }}>
        <h2>Admin login</h2>
        {searchParams?.error && <div className="msg err">Wrong password</div>}
        <input type="password" name="password" placeholder="Password" required autoFocus style={{ marginBottom: 12 }} />
        <button className="btn">Log in</button>
      </form>
    </main>
  );

  await ensureTable();
  const q = (searchParams?.q || "").trim();
  const like = `%${q}%`;
  const rows = q
    ? await sql()`SELECT * FROM submissions WHERE company_en ILIKE ${like} OR company_ar ILIKE ${like} OR contact ILIKE ${like} OR email ILIKE ${like} ORDER BY created_at DESC`
    : await sql()`SELECT * FROM submissions ORDER BY created_at DESC`;

  return (
    <main className="wrap admin">
      <div className="bar">
        <h1 style={{ margin: 0, fontSize: "1.4rem" }}>Submissions ({rows.length})</h1>
        <form style={{ display: "flex", gap: 8, flex: 1, justifyContent: "flex-end" }}>
          <input name="q" defaultValue={q} placeholder="Search company, contact, email…" />
          <a className="small-btn" href="/admin/export">CSV</a>
        </form>
        <form method="post" action="/api/login"><button className="small-btn" name="logout" value="1" style={{ background: "#6b7385" }}>Logout</button></form>
      </div>
      <div className="tablewrap"><table>
        <thead><tr>
          {["#", "Date", "Company (EN)", "Company (AR)", "Contact", "E-mail", "Phone", "Mobile", "WhatsApp", "Emirate", "Building", "Floor", "Office", "Services"].map(h => <th key={h}>{h}</th>)}
        </tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={14} style={{ textAlign: "center", padding: 30 }}>No submissions yet.</td></tr>}
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai" })}</td>
              <td>{r.company_en}</td><td dir="rtl">{r.company_ar}</td><td>{r.contact}</td>
              <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
              <td>{r.phone}</td><td>{r.mobile}</td>
              <td>{r.whatsapp && <a href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`} target="_blank">{r.whatsapp}</a>}</td>
              <td>{r.emirate}</td><td>{r.building}</td><td>{r.floor}</td><td>{r.office}</td>
              <td><ol>{(r.services || []).map((s, i) => <li key={i}>{s}</li>)}</ol></td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </main>
  );
}
