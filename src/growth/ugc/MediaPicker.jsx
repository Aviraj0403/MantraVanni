import React, { useEffect, useRef, useState } from "react";
import { toast } from "../../utils/toast";
import { getUgcPublicConfig, uploadMedia } from "./ugcApi";

/**
 * Photo / video upload control for the review form. Calls onChange(items) with [{type,url,bytes,duration}] of finished uploads.
 * Rendered by ReviewTab only when the ugcReviews add-on is on; renders nothing if the store config cannot be read.
 */
export default function MediaPicker({ onChange }) {
  const [cfg, setCfg] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    let live = true;
    getUgcPublicConfig().then((c) => live && setCfg(c)).catch(() => {});
    return () => { live = false; };
  }, []);
  useEffect(() => { onChange?.(items); }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cfg) return null;
  const max = cfg.maxMediaPerReview || 3;

  const pick = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = max - items.length;
    if (room <= 0) { toast.error(`You can add up to ${max} photos or videos.`); return; }
    setBusy(true);
    const next = [];
    for (const f of files.slice(0, room)) {
      try { next.push({ ...(await uploadMedia(f, cfg)), local: URL.createObjectURL(f) }); }
      catch (err) { toast.error(err?.message || "Upload failed."); }
    }
    if (files.length > room) toast.error(`Only ${max} files are allowed per review.`);
    if (next.length) setItems((cur) => [...cur, ...next]);
    setBusy(false);
  };
  const remove = (url) => setItems((cur) => cur.filter((m) => m.url !== url));

  return (
    <div className="mt-8 rounded-2xl border border-secondary-200 bg-brand-bg p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-brand-text">Add photos{cfg.allowVideos ? " or a short video" : ""} (optional)</h4>
          <p className="text-xs text-gray-500">
            Up to {max} files, {cfg.maxFileMB} MB each{cfg.allowVideos ? `, videos up to ${cfg.maxVideoSeconds} seconds` : ""}.
            {cfg.requireApprovalForMedia ? " Photos and videos appear after our team approves them." : ""}
          </p>
        </div>
        <button type="button" onClick={() => input.current?.click()} disabled={busy || items.length >= max}
          className="rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? "Uploading..." : "Choose files"}
        </button>
        <input ref={input} type="file" multiple hidden onChange={pick}
          accept={cfg.allowVideos ? "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/webp"} />
      </div>
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((m) => (
            <div key={m.url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-secondary-200 bg-black">
              {m.type === "video" ? <video src={m.local} muted preload="metadata" className="h-full w-full object-cover" /> : <img src={m.local} alt="" className="h-full w-full object-cover" />}
              <button type="button" onClick={() => remove(m.url)} aria-label="Remove" className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white">x</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
