"use client";
import { useState, useEffect } from "react";

const fmt = d => new Date(d).toLocaleString("en-GB", { timeZone: "Asia/Dubai" });
const wa = n => `https://wa.me/${n.replace(/\D/g, "")}`;
const HEAD = ["#", "Date", "Company (EN)", "Company (AR)", "Contact", "E-mail", "Phone", "Mobile", "WhatsApp", "Emirate", "Building", "Floor", "Office", "Services"];

function Row({ label, children }) {
  return <div className="drow"><div className="dlabel">{label}</div><div className="dval">{children || <span className="muted">-</span>}</div></div>;
}

export default function AdminTable({ rows }) {
  const [sel, setSel] = useState(null);
  useEffect(() => {
    const k = e => e.key === "Escape" && setSel(null);
    window.addEventListener("keydown", k);
    document.body.style.overflow = sel ? "hidden" : "";
    return () => window.removeEventListener("keydown", k);
  }, [sel]);

  return (
    <>
      <div className="tablewrap"><table>
        <thead><tr>{HEAD.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={14} style={{ textAlign: "center", padding: 30 }}>No submissions yet.</td></tr>}
          {rows.map(r => (
            <tr key={r.id} className="clickable" onClick={() => setSel(r)}>
              <td>{r.id}</td><td>{fmt(r.created_at)}</td>
              <td>{r.company_en}</td><td dir="rtl">{r.company_ar}</td><td>{r.contact}</td>
              <td>{r.email}</td><td>{r.phone}</td><td>{r.mobile}</td><td>{r.whatsapp}</td>
              <td>{r.emirate}</td><td>{r.building}</td><td>{r.floor}</td><td>{r.office}</td>
              <td>{(r.services || []).length} service{(r.services || []).length === 1 ? "" : "s"}</td>
            </tr>
          ))}
        </tbody>
      </table></div>

      {sel && (
        <div className="overlay" onClick={() => setSel(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <div className="mhead">
              <div>
                <h2>{sel.company_en}</h2>
                {sel.company_ar && <div dir="rtl" className="muted">{sel.company_ar}</div>}
              </div>
              <button className="icon-btn" aria-label="Close" onClick={() => setSel(null)}>✕</button>
            </div>
            <div className="muted small">Submission #{sel.id} · {fmt(sel.created_at)}</div>

            <h3>Contact</h3>
            <Row label="Contact person">{sel.contact}</Row>
            <Row label="E-mail"><a href={`mailto:${sel.email}`}>{sel.email}</a></Row>
            <Row label="Phone">{sel.phone && <a href={`tel:${sel.phone}`}>{sel.phone}</a>}</Row>
            <Row label="Mobile">{sel.mobile && <a href={`tel:${sel.mobile}`}>{sel.mobile}</a>}</Row>
            <Row label="WhatsApp">{sel.whatsapp && <a href={wa(sel.whatsapp)} target="_blank">{sel.whatsapp}</a>}</Row>

            <h3>Address</h3>
            <Row label="Emirate">{sel.emirate}</Row>
            <Row label="Building">{sel.building}</Row>
            <Row label="Floor">{sel.floor}</Row>
            <Row label="Office">{sel.office}</Row>

            <h3>Services</h3>
            {(sel.services || []).length
              ? <ol className="svclist">{sel.services.map((s, i) => <li key={i}>{s}</li>)}</ol>
              : <div className="muted">No services listed.</div>}
          </div>
        </div>
      )}
    </>
  );
}
