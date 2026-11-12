import React, { useEffect, useState } from "react";
import { Download, Loader2, AlertCircle, FileDown } from "lucide-react";
import Axios from "../../utils/Axios";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "");
const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round((b || 0) / 1024))} KB`);
const apiMessage = (e, fb) => {
  if (e?.response?.status === 429) return "Too many requests. Please wait a minute and try again.";
  return e?.response?.data?.message || fb;
};

/** Customer download list. Each click asks the server for a fresh short-lived signed link, then opens it. */
export default function DownloadsList() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState(null);

  const load = () =>
    Axios.get("/digital-products/mine", { timeout: 15000 })
      .then((r) => { setItems(r.data?.items || []); setError(""); })
      .catch((e) => { setItems([]); setError(apiMessage(e, "Could not load your downloads. Please try again.")); });
  useEffect(() => { load(); }, []);

  const download = async (it, f) => {
    const key = `${it.id}:${f.index}`;
    if (busy) return;
    setBusy(key); setNotice(null);
    try {
      const r = await Axios.post(`/digital-products/mine/${it.id}/link`, { fileIndex: f.index });
      if (r.data?.url) {
        // The link is valid for a few minutes only; a hidden anchor keeps popup blockers quiet.
        const a = document.createElement("a");
        a.href = r.data.url; a.rel = "noopener noreferrer"; a.target = "_blank";
        document.body.appendChild(a); a.click(); a.remove();
        setNotice({ type: "ok", text: `Your download is starting. ${r.data.remaining} download${r.data.remaining === 1 ? "" : "s"} left for this item.` });
      }
      await load();
    } catch (e) {
      setNotice({ type: "error", text: apiMessage(e, "Could not start the download. Please try again.") });
      await load();
    } finally { setBusy(""); }
  };

  if (items === null) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary-500" /></div>;
  return (
    <div className="space-y-4">
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div>}
      {notice && (
        <div role={notice.type === "error" ? "alert" : "status"} className={`rounded-xl border px-3 py-2 text-sm ${notice.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{notice.text}</div>
      )}
      {!error && items.length === 0 && (
        <div className="rounded-2xl border border-secondary-200 bg-white p-8 text-center">
          <FileDown className="mx-auto mb-2 text-secondary-400" />
          <p className="text-sm font-semibold text-brand-text">No downloads yet</p>
          <p className="mt-1 text-xs text-secondary-500">Digital purchases appear here once your payment is confirmed.</p>
        </div>
      )}
      {items.map((it) => {
        const usable = it.status === "active";
        return (
          <div key={it.id} className="rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {it.image && <img src={it.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" loading="lazy" />}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold text-brand-text">{it.productName}</h3>
                <p className="mt-0.5 text-xs text-secondary-500">
                  {it.remaining} of {it.downloadLimit} downloads left{it.expiresAt ? ` · access until ${fmtDate(it.expiresAt)}` : " · no expiry"}
                </p>
              </div>
            </div>
            {!usable && it.message && <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{it.message}</p>}
            <ul className="mt-3 space-y-2">
              {it.files.map((f) => (
                <li key={f.index} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary-50 px-3 py-2">
                  <span className="min-w-0 truncate text-sm text-brand-text">{f.label} <span className="text-xs text-secondary-500">({fmtSize(f.bytes)})</span></span>
                  <button type="button" disabled={!usable || !!busy} onClick={() => download(it, f)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-primary-600 disabled:opacity-50">
                    {busy === `${it.id}:${f.index}` ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <p className="text-xs text-secondary-500">Download links are private and expire within minutes. If a link stops working, press Download again to get a fresh one.</p>
    </div>
  );
}
