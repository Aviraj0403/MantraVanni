import React, { useCallback, useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import { loadSubsConfig, listMine, act, changeFrequency, apiMessage, fmtDate } from "./api";

const STATUS_CLS = { active: "bg-green-100 text-green-800", paused: "bg-amber-100 text-amber-800", cancelled: "bg-gray-100 text-gray-600" };

function Row({ s, cfg, onChanged }) {
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [freq, setFreq] = useState(s.frequencyDays);
  const [editing, setEditing] = useState(false);

  const run = async (key, fn) => {
    if (busy) return;
    setBusy(key); setErr("");
    try { await fn(); await onChanged(); setEditing(false); }
    catch (e) { setErr(apiMessage(e)); }
    finally { setBusy(""); }
  };
  const canPauseSkip = cfg?.allowCustomerPauseSkip !== false;
  const btn = "rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 disabled:opacity-50";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          {s.items.map((i, n) => (
            <div key={n} className="flex items-center gap-2 py-0.5">
              {i.image && <img src={i.image} alt="" className="h-10 w-10 rounded-lg object-cover" loading="lazy" />}
              <div className="min-w-0 text-sm"><div className="truncate font-medium text-gray-900">{i.name}{i.variantSize ? ` (${i.variantSize})` : ""}</div><div className="text-xs text-gray-500">Qty {i.quantity}</div></div>
            </div>
          ))}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLS[s.status] || STATUS_CLS.cancelled}`}>{s.status}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:grid-cols-4">
        <div><div className="text-gray-400">Every</div>{s.frequencyDays} days</div>
        <div><div className="text-gray-400">Next delivery</div>{s.status === "active" ? fmtDate(s.nextRunAt) : s.status === "paused" ? "Paused" : "-"}</div>
        <div><div className="text-gray-400">Payment</div>{s.paymentMethod === "wallet" ? "Wallet" : "Cash on Delivery"}</div>
        <div><div className="text-gray-400">Per delivery</div>Rs {Number(s.estimatedTotal).toFixed(2)}{s.discountPercent ? ` (${s.discountPercent}% off)` : ""}</div>
      </div>
      {s.failureCount > 0 && s.status === "active" && <p className="mt-2 text-xs text-amber-700">The last attempt could not be completed (for example low wallet balance or stock). We will try again tomorrow.</p>}
      {s.status !== "cancelled" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {s.status === "active" && canPauseSkip && <button className={btn} disabled={!!busy} onClick={() => run("pause", () => act(s.id, "pause"))}>Pause</button>}
          {s.status === "paused" && canPauseSkip && <button className={btn} disabled={!!busy} onClick={() => run("resume", () => act(s.id, "resume"))}>Resume</button>}
          {s.status === "active" && canPauseSkip && <button className={btn} disabled={!!busy} onClick={() => run("skip", () => act(s.id, "skip"))}>Skip next</button>}
          <button className={btn} disabled={!!busy} onClick={() => setEditing((v) => !v)}>Change frequency</button>
          <button className={`${btn} !border-red-200 !text-red-600`} disabled={!!busy} onClick={() => { if (window.confirm("Cancel this subscription?")) run("cancel", () => act(s.id, "cancel")); }}>Cancel</button>
        </div>
      )}
      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm" value={freq} onChange={(e) => setFreq(Number(e.target.value))}>
            {(cfg?.allowedFrequencies || [s.frequencyDays]).map((f) => <option key={f} value={f}>Every {f} days</option>)}
          </select>
          <button className={btn} disabled={!!busy || freq === s.frequencyDays} onClick={() => run("freq", () => changeFrequency(s.id, freq))}>Save</button>
        </div>
      )}
      {err && <p role="alert" className="mt-2 text-xs text-red-600">{err}</p>}
    </div>
  );
}

export default function MySubscriptions() {
  const [cfg, setCfg] = useState(null);
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try { setRows(await listMine()); setFailed(false); } catch { setFailed(true); setRows([]); }
  }, []);
  useEffect(() => { loadSubsConfig().then(setCfg); load(); }, [load]);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900"><Repeat size={20} /> Subscriptions</h2>
      {rows === null && <div className="h-24 animate-pulse rounded-2xl bg-gray-100" />}
      {failed && <p className="text-sm text-gray-500">We could not load your subscriptions right now.</p>}
      {rows && !failed && rows.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">You have no subscriptions yet. Look for "Subscribe &amp; save" on a product page.</p>}
      {rows && rows.map((s) => <Row key={s.id} s={s} cfg={cfg} onChanged={load} />)}
      <p className="text-xs text-gray-400">Automatic orders are paid by Cash on Delivery or Wallet. If your wallet balance is low on the delivery day we will let you know and try again the next day.</p>
    </div>
  );
}
