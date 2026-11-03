"use client";
import { useState } from "react";

const EMIRATES = ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];
const MAX = 10;

function Field({ label, name, required, full, ...rest }) {
  return (
    <div className={full ? "full" : ""}>
      <label htmlFor={name}>{label} {required && <span className="req">*</span>}</label>
      <input id={name} name={name} required={required} {...rest} />
    </div>
  );
}

export default function Home() {
  const [services, setServices] = useState(Array(MAX).fill(""));
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const setSvc = (i, v) => setServices(s => s.map((x, j) => (j === i ? v : x)));

  async function onSubmit(e) {
    e.preventDefault();
    setState("sending"); setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.services = services.map(s => s.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Something went wrong");
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err.message); setState("idle"); }
  }

  if (state === "done") return (
    <main className="wrap"><div className="card done">
      <div className="check">✓</div>
      <h1>Thank you!</h1>
      <p>Your details have been submitted successfully.</p>
      <button className="small-btn" onClick={() => { setServices(Array(MAX).fill("")); setState("idle"); }}>Submit another</button>
    </div></main>
  );

  return (
    <main className="wrap">
      <div className="hero"><h1>Company Services Form</h1><p>Fill in your details below. It only takes a minute.</p></div>
      <form onSubmit={onSubmit} className="card">
        <section className="sec">
          <h2><span className="n">1</span>Company</h2>
          <div className="grid">
            <Field label="Company Name (English)" name="company_en" required placeholder="e.g. Al Noor Trading LLC" />
            <Field label="Company Name (Arabic)" name="company_ar" dir="rtl" lang="ar" placeholder="اسم الشركة" />
          </div>
        </section>

        <section className="sec">
          <h2><span className="n">2</span>Contact</h2>
          <div className="grid">
            <Field label="Contact Person" name="contact" required autoComplete="name" placeholder="Full name" />
            <Field label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" placeholder="name@company.com" />
            <Field label="Phone" name="phone" type="tel" inputMode="tel" placeholder="+971 4 000 0000" />
            <Field label="Mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="+971 50 000 0000" />
            <Field label="WhatsApp" name="whatsapp" type="tel" inputMode="tel" placeholder="+971 50 000 0000" />
          </div>
        </section>

        <section className="sec">
          <h2><span className="n">3</span>Address</h2>
          <div className="grid">
            <div>
              <label htmlFor="emirate">Emirate</label>
              <select id="emirate" name="emirate" defaultValue="">
                <option value="" disabled>Select emirate</option>
                {EMIRATES.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <Field label="Building Name / Number" name="building" placeholder="e.g. Business Bay Tower" />
            <Field label="Floor #" name="floor" inputMode="numeric" placeholder="e.g. 12" />
            <Field label="Office #" name="office" placeholder="e.g. 1204" />
          </div>
        </section>

        <section className="sec">
          <h2><span className="n">4</span>Services List</h2>
          <p className="hint">List up to {MAX} services your company provides.</p>
          {services.map((s, i) => (
            <div className="svc" key={i}>
                            <input value={s} onChange={e => setSvc(i, e.target.value)} placeholder={`Service ${i + 1}`} aria-label={`Service ${i + 1}`} />
            </div>
          ))}
        </section>

        {error && <div className="msg err">{error}</div>}
        <button className="btn" disabled={state === "sending"}>{state === "sending" ? "Submitting…" : "Submit"}</button>
      </form>
    </main>
  );
}
