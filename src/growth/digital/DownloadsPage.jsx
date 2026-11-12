import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DownloadsList from "./DownloadsList";

/** /downloads (digitalProducts:downloads). Requires a logged-in customer. */
export default function DownloadsPage() {
  const { user } = useAuth() || {};
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-4 text-xl font-bold text-brand-text">My downloads</h1>
      {user ? <DownloadsList /> : (
        <div className="rounded-2xl border border-secondary-200 bg-white p-6 text-center text-sm">
          <p className="mb-3 text-brand-text">Please sign in to see your downloads.</p>
          <Link to="/login" className="inline-block rounded-xl bg-primary-500 px-4 py-2 font-bold text-white">Sign in</Link>
        </div>
      )}
    </main>
  );
}
