import { cookies } from "next/headers";
import { sql, ensureTable } from "@/lib/db";
import { COOKIE, token } from "@/lib/auth";
import AdminTable from "./AdminTable";

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
      <AdminTable rows={rows.map(r => ({ ...r, created_at: new Date(r.created_at).toISOString() }))} />
    </main>
  );
}
