import React, { useEffect, useState } from "react";
import { toast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import { getQuestions, askQuestion, answerQuestion, markHelpful, apiMessage } from "./ugcApi";

const VOTED_KEY = "ugcHelpfulVotes";
const readVotes = () => { try { return JSON.parse(localStorage.getItem(VOTED_KEY) || "[]"); } catch { return []; } };
const writeVote = (id) => { try { localStorage.setItem(VOTED_KEY, JSON.stringify([...new Set([...readVotes(), id])].slice(-200))); } catch { /* storage blocked */ } };
const dateOf = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } };

function AnswerBox({ q, onDone }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (text.trim().length < 2) return;
    setBusy(true);
    try { await answerQuestion(q.id, text.trim()); toast.success("Thanks for helping!"); setText(""); setOpen(false); onDone(); }
    catch (e) { toast.error(apiMessage(e, "Could not post your answer.")); }
    finally { setBusy(false); }
  };
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="text-xs font-medium text-primary-600 hover:underline">Answer this question</button>;
  return (
    <div className="mt-2">
      <textarea rows={2} maxLength={800} value={text} onChange={(e) => setText(e.target.value)} placeholder="Share what you know..." aria-label="Your answer"
        className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:border-primary-500 focus:outline-none" />
      <div className="mt-1 flex gap-2">
        <button type="button" onClick={submit} disabled={busy || text.trim().length < 2} className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50">{busy ? "Posting..." : "Post answer"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-gray-500">Cancel</button>
      </div>
    </div>
  );
}

/** Questions & Answers block for the product page. Renders nothing while loading, when off, or on failure (unless there is something to show / ask). */
export default function Questions({ productId }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [voted, setVoted] = useState(readVotes);

  const load = async (p = 1, append = false) => {
    try {
      const r = await getQuestions(productId, p);
      setData(r); setPage(p);
      setList((cur) => (append ? [...cur, ...(r.questions || [])] : r.questions || []));
    } catch { if (!append) setData(null); }
  };
  useEffect(() => { setData(null); setList([]); if (productId) load(1); }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data || data.enabled === false) return null;

  const ask = async () => {
    const q = text.trim();
    if (q.length < 10) { toast.error("Please write at least 10 characters."); return; }
    setBusy(true);
    try { const r = await askQuestion(productId, q); toast.success(r.message || "Question submitted."); setText(""); if (r.status === "approved") await load(1); }
    catch (e) { toast.error(apiMessage(e, "Could not post your question.")); }
    finally { setBusy(false); }
  };
  const helpful = async (q) => {
    if (!user) { window.location.href = "/signin"; return; }
    if (voted.includes(q.id)) return;
    try {
      const r = await markHelpful(q.id);
      writeVote(q.id); setVoted(readVotes());
      setList((cur) => cur.map((x) => (x.id === q.id ? { ...x, helpfulCount: r.helpfulCount ?? x.helpfulCount } : x)));
    } catch (e) { toast.error(apiMessage(e, "Could not save your vote.")); }
  };

  return (
    <section className="py-6" aria-label="Questions and answers">
      <h3 className="mb-3 text-lg font-semibold text-brand-text">Questions &amp; Answers{data.total ? ` (${data.total})` : ""}</h3>
      {list.length === 0 && <p className="mb-3 text-sm text-gray-500">No questions yet. Ask the first one!</p>}
      <ul className="space-y-3">
        {list.map((q) => (
          <li key={q.id} className="rounded-xl border border-secondary-200 bg-brand-bg p-4">
            <p className="break-words text-sm font-semibold text-brand-text">Q: {q.question}</p>
            <p className="mt-0.5 text-xs text-gray-500">{q.userName} &middot; {dateOf(q.createdAt)}</p>
            {q.answers.map((a) => (
              <div key={a.id} className="mt-2 rounded-lg bg-white/60 p-2.5 text-sm">
                <p className="break-words text-brand-text">A: {a.text}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {a.by === "admin" ? <span className="rounded bg-primary-100 px-1.5 py-0.5 font-medium text-primary-700">Store</span> : a.userName} &middot; {dateOf(a.createdAt)}
                </p>
              </div>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => helpful(q)} disabled={voted.includes(q.id)} className="text-xs text-gray-600 hover:text-primary-600 disabled:text-gray-400">
                {voted.includes(q.id) ? "Thanks for voting" : "Helpful"} ({q.helpfulCount || 0})
              </button>
              {data.allowAnswers && (user ? <AnswerBox q={q} onDone={() => load(1)} /> : <a href="/signin" className="text-xs font-medium text-primary-600 hover:underline">Sign in to answer</a>)}
            </div>
          </li>
        ))}
      </ul>
      {page < (data.totalPages || 1) && (
        <button type="button" onClick={() => load(page + 1, true)} className="mt-3 text-sm font-medium text-primary-600 hover:underline">Show more questions</button>
      )}
      <div className="mt-4 rounded-xl border border-secondary-200 bg-brand-bg p-4">
        {user ? (
          <>
            <label htmlFor="ugc-q" className="mb-2 block text-sm font-semibold text-brand-text">Ask a question about this product</label>
            <textarea id="ugc-q" rows={2} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Is it suitable for daily use?"
              className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-primary-500 focus:outline-none" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{text.length}/300</span>
              <button type="button" onClick={ask} disabled={busy || text.trim().length < 10} className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{busy ? "Posting..." : "Post question"}</button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">Have a question? <a href="/signin" className="font-medium text-primary-600 hover:underline">Sign in</a> to ask it.</p>
        )}
      </div>
    </section>
  );
}
