import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";
import OtpInput from "../components/OtpInput";
import { getPublicSettings } from "../services/settingsApi";

const OTP_LENGTH = 6;

/**
 * Phone sign-in inside the checkout page. Uses exactly the calls the /signin page makes
 * (AuthContext.sendPhoneOTP / verifyPhoneOTP / phoneDirectLogin: same endpoints, same token storage, same error messages).
 * On success AuthContext updates `user`, so the checkout re-renders as signed in; no navigation is needed.
 */
export default function InlineOtpLogin({ signInHref = "/signin?redirect=/checkout" }) {
  const { sendPhoneOTP, verifyPhoneOTP, phoneDirectLogin } = useAuth();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [direct, setDirect] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicSettings().then((s) => {
      if (active && s?.phoneLoginMode === "direct") setDirect(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const guard = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const sendOtp = () =>
    guard(async () => {
      if (mobile.length !== 10) return toast.error("Please enter a 10-digit number");
      try {
        const response = await sendPhoneOTP(`+91${mobile}`, sessionId);
        setSessionId(response.sessionId || sessionId);
        setOtp("");
        toast.success(response.message || "OTP sent");
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || "Could not send OTP");
      }
    });

  const directLogin = () =>
    guard(async () => {
      if (mobile.length !== 10) return toast.error("Please enter a 10-digit number");
      try {
        const response = await phoneDirectLogin(`+91${mobile}`);
        toast.success(response?.message?.replace(/\s*\(.*\)/, "") || "Login successful");
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || "Login failed");
      }
    });

  const verifyOtp = () =>
    guard(async () => {
      if (otp.length !== OTP_LENGTH) return toast.error(`Enter the ${OTP_LENGTH}-digit OTP`);
      try {
        await verifyPhoneOTP(sessionId, otp);
        toast.success("Login successful");
      } catch (err) {
        toast.error(err?.response?.data?.message || err?.message || "OTP verification failed");
      }
    });

  const btn =
    "w-full bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="co-mobile" className="block text-sm font-medium text-brand-text mb-1">Mobile number</label>
        <div className="flex rounded-xl overflow-hidden border border-secondary-200 focus-within:ring-2 focus-within:ring-primary-400 bg-brand-bg">
          <span className="flex items-center gap-1 px-3 border-r border-secondary-200 text-primary-700 font-medium bg-secondary-50">
            <Phone size={14} aria-hidden="true" /> +91
          </span>
          <input
            id="co-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            disabled={!!sessionId && !direct}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && !sessionId && (direct ? directLogin() : sendOtp())}
            placeholder="10 digit mobile number"
            className="flex-1 min-w-0 px-3 py-3 outline-none bg-transparent"
          />
        </div>
      </div>

      {direct ? (
        <button type="button" onClick={directLogin} disabled={busy || mobile.length !== 10} className={btn}>
          {busy ? "Signing in..." : "Continue"}
        </button>
      ) : !sessionId ? (
        <button type="button" onClick={sendOtp} disabled={busy || mobile.length !== 10} className={btn}>
          {busy ? "Sending OTP..." : "Send OTP"}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-center text-brand-text">Enter the {OTP_LENGTH}-digit OTP sent to +91 {mobile}</p>
          <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
          <button type="button" onClick={verifyOtp} disabled={busy || otp.length !== OTP_LENGTH} className={btn}>
            {busy ? "Verifying..." : "Verify & continue"}
          </button>
          <div className="flex justify-between text-xs text-gray-600">
            <button type="button" onClick={sendOtp} disabled={busy} className="underline">Resend OTP</button>
            <button type="button" onClick={() => { setSessionId(null); setOtp(""); }} className="underline">Change number</button>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-500">
        Prefer email or Google? <a href={signInHref} className="underline text-primary-600">Use the full sign-in page</a>
      </p>
    </div>
  );
}
