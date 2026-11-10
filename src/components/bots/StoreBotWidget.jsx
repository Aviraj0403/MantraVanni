import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicSettings } from "../../services/settingsApi";
import { sendStoreChat } from "./botApi";

const SESSION_KEY = "jdbot_session";
const getSession = () => {
  try {
    let s = sessionStorage.getItem(SESSION_KEY);
    if (!s) {
      s = `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
      sessionStorage.setItem(SESSION_KEY, s);
    }
    return s;
  } catch {
    return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }
};

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// Tiny, safe markdown-lite: **bold**, bullet lists. Rendered as React nodes only (no HTML injection).
const Rich = ({ text }) => {
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  return (
    <div className="space-y-1 break-words text-sm leading-relaxed">
      {lines.map((l, i) => {
        const bullet = l.match(/^\s*[-*•]\s+(.*)$/);
        const body = bullet ? bullet[1] : l;
        const parts = body.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
          /^\*\*[^*]+\*\*$/.test(p) ? <strong key={j}>{p.slice(2, -2)}</strong> : <React.Fragment key={j}>{p}</React.Fragment>
        );
        if (!l.trim()) return <div key={i} className="h-1" />;
        return bullet ? <div key={i} className="flex gap-2"><span aria-hidden="true">•</span><span>{parts}</span></div> : <p key={i}>{parts}</p>;
      })}
    </div>
  );
};

const StoreBotWidget = () => {
  const [cfg, setCfg] = useState(null); // null => not rendered (fail closed)
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]); // {role, content, products?, error?}
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [quick, setQuick] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const sessionRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getPublicSettings()
      .then((s) => {
        const ss = s?.storeSupport;
        if (alive && ss?.enabled) {
          setCfg(ss);
          setQuick(Array.isArray(ss.quickReplies) ? ss.quickReplies : []);
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); launcherRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    const tm = setTimeout(() => inputRef.current?.focus(), 50);
    return () => { window.removeEventListener("keydown", onKey); clearTimeout(tm); };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy, open, showOrder]);

  const send = useCallback(async (text, display) => {
    const message = String(text || "").trim().slice(0, 500);
    if (!message || busy) return;
    if (!sessionRef.current) sessionRef.current = getSession();
    const history = msgs.filter((m) => !m.error).slice(-10).map((m) => ({ role: m.role, content: String(m.content).slice(0, 500) }));
    setMsgs((m) => [...m, { role: "user", content: display || message }]);
    setInput("");
    setBusy(true);
    try {
      const r = await sendStoreChat({ message, history, sessionId: sessionRef.current });
      setMsgs((m) => [...m, { role: "assistant", content: r.reply || "Sorry, I could not find an answer.", products: Array.isArray(r.products) ? r.products : [] }]);
      if (Array.isArray(r.quickReplies)) setQuick(r.quickReplies);
    } catch (e) {
      if (e.code === "BOT_DISABLED") { setCfg(null); setOpen(false); return; }
      let msg = "Sorry, something went wrong. Please try again.";
      if (e.code === "RATE_LIMITED") msg = "You are sending messages too fast. Please wait a moment and try again.";
      else if (e.code === "BOT_QUOTA_EXCEEDED") msg = "Our assistant is resting for now. Please contact support directly.";
      else if (e.code === "BOT_UNAVAILABLE") msg = e.reply || "The assistant is unavailable right now. Please try again shortly.";
      setMsgs((m) => [...m, { role: "assistant", content: msg, error: true }]);
    } finally {
      setBusy(false);
    }
  }, [busy, msgs]);

  const submitOrder = (e) => {
    e.preventDefault();
    const id = orderId.trim();
    const digits = phone.replace(/\D/g, "");
    if (!id || digits.length < 10) return;
    setShowOrder(false);
    setOrderId("");
    setPhone("");
    send(`Check the status of my order ${id}. The phone number on the order is ${digits}.`, `Track order ${id} (phone ******${digits.slice(-4)})`);
  };

  if (!cfg) return null;

  const color = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(cfg.brandColor || "") ? cfg.brandColor : "#ff9900";
  const side = cfg.position === "left" ? "left" : "right";
  const name = cfg.name || "Assistant";
  const avatar = typeof cfg.avatarUrl === "string" && cfg.avatarUrl.startsWith("https://") ? cfg.avatarUrl : "";

  const Avatar = ({ size = 36 }) => avatar
    ? <img src={avatar} alt="" width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
    : <span className="flex items-center justify-center rounded-full bg-white/25" style={{ width: size, height: size }} aria-hidden="true">
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      </span>;

  return (
    <>
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Chat with ${name}`}
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[60] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl md:bottom-[max(1rem,env(safe-area-inset-bottom))] transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20"
          style={{ backgroundColor: color, [side]: "1rem" }}
        >
          <Avatar size={30} />
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label={`${name} chat`}
          className="fixed inset-0 z-[120] flex h-dvh flex-col overflow-hidden bg-white shadow-2xl sm:inset-auto sm:h-[600px] sm:max-h-[calc(100dvh-2rem)] sm:w-[380px] sm:rounded-2xl sm:border sm:border-gray-200"
          style={{ ...(window.innerWidth >= 640 ? { [side]: "1.25rem", bottom: "1.25rem" } : {}), paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <header className="flex items-center gap-3 px-4 py-3 text-white" style={{ backgroundColor: color }}>
            <Avatar />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{name}</div>
              <div className="text-xs opacity-80">We usually reply instantly</div>
            </div>
            <button type="button" onClick={() => { setOpen(false); launcherRef.current?.focus(); }} aria-label="Close chat" className="rounded-lg p-2 text-xl leading-none hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">×</button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-gray-50 px-4 py-4" aria-live="polite">
            <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-800">{cfg.greeting || "Hi! How can I help you today?"}</div>

            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button key={q} type="button" onClick={() => send(q)} className="rounded-full border bg-white px-3 py-1.5 text-xs text-gray-700 transition hover:text-white" style={{ borderColor: color }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; }}>{q}</button>
                ))}
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-2"}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${m.role === "user" ? "rounded-tr-sm text-white" : `rounded-tl-sm border bg-white ${m.error ? "border-red-300 text-red-600" : "border-gray-200 text-gray-800"}`}`}
                  style={m.role === "user" ? { backgroundColor: color } : undefined}
                >
                  {m.role === "user" ? <p className="whitespace-pre-wrap break-words text-sm">{m.content}</p> : <Rich text={m.content} />}
                </div>
                {m.products?.length > 0 && (
                  <div className="flex w-full snap-x gap-2 overflow-x-auto pb-1">
                    {m.products.map((p) => (
                      <Link key={p.slug} to={`/product/${encodeURIComponent(p.slug)}`} onClick={() => setOpen(false)} className="w-36 shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                        {p.image ? <img src={p.image} alt={p.name} loading="lazy" className="h-28 w-full object-cover" /> : <div className="h-28 w-full bg-gray-100" />}
                        <div className="p-2">
                          <div className="line-clamp-2 text-xs font-medium text-gray-800">{p.name}</div>
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="text-sm font-semibold text-gray-900">{inr(p.price)}</span>
                            {p.mrp > p.price && <span className="text-[11px] text-gray-400 line-through">{inr(p.mrp)}</span>}
                          </div>
                          {!p.inStock && <div className="mt-0.5 text-[11px] text-red-600">Out of stock</div>}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {busy && (
              <div className="flex" role="status" aria-label="Assistant is typing">
                <div className="flex gap-1 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-3">
                  {[0, 150, 300].map((d) => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}

            {showOrder && (
              <form onSubmit={submitOrder} className="space-y-2 rounded-xl border border-gray-200 bg-white p-3">
                <div className="text-xs font-semibold text-gray-700">Track your order</div>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value.slice(0, 60))} placeholder="Order ID (e.g. ORD-...)" aria-label="Order ID" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm outline-none focus:border-gray-500" />
                <input value={phone} onChange={(e) => setPhone(e.target.value.slice(0, 20))} inputMode="tel" placeholder="Phone number on the order" aria-label="Phone number" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm outline-none focus:border-gray-500" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ backgroundColor: color }}>Check status</button>
                  <button type="button" onClick={() => setShowOrder(false)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600">Cancel</button>
                </div>
              </form>
            )}
          </div>

          <div className="border-t border-gray-200 bg-white p-3">
            {!showOrder && (
              <button type="button" onClick={() => setShowOrder(true)} className="mb-2 text-xs font-medium underline" style={{ color }}>Track my order</button>
            )}
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Type your message..."
                aria-label="Type your message"
                className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-base text-gray-900 outline-none focus:border-gray-500 sm:text-sm"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-50" style={{ backgroundColor: color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreBotWidget;
