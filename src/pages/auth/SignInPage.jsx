import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "../../utils/toast";
import { safeRedirect } from "../../utils/Axios";
import OtpInput from "../../components/OtpInput";
import { Phone, Lock, User, Mail, ChevronRight } from "lucide-react";

const OTP_LENGTH = 6;

const SignInPage = () => {
  const [loginType, setLoginType] = useState("mobile");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSessionId, setOtpSessionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    login,
    googleLogin,
    sendPhoneOTP,
    verifyPhoneOTP,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Only same-site relative paths are honoured (open-redirect protection).
  const redirectTo = safeRedirect(
    location.state?.from?.pathname ||
      (typeof location.state?.from === "string" ? location.state.from : null) ||
      new URLSearchParams(location.search).get("redirect"),
    "/"
  );

  /* ---------------- EMAIL LOGIN ---------------- */
  const handleCustomSignIn = async () => {
    if (!emailOrUsername || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        email: emailOrUsername.includes("@") ? emailOrUsername : undefined,
        userName: !emailOrUsername.includes("@") ? emailOrUsername : undefined,
        password,
      });
      toast.success("Successfully logged in");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Invalid login details");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- PHONE OTP LOGIN ---------------- */
  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      toast.error("Please enter a 10-digit number");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await sendPhoneOTP(`+91${mobile}`, otpSessionId);
      setOtpSessionId(response.sessionId || otpSessionId);
      setOtp("");
      toast.success(response.message || "OTP sent");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Could not send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      toast.error(`Enter the ${OTP_LENGTH}-digit OTP`);
      return;
    }
    setIsSubmitting(true);
    try {
      await verifyPhoneOTP(otpSessionId, otp);
      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
      toast.success("Logged in with Google");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Google login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-black/20 focus:bg-black/40 text-white placeholder-gray-500";
  const primaryBtn = "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 font-semibold shadow-lg shadow-primary-500/20";

  return (
    <div
      className="flex items-center justify-center md:justify-end min-h-screen bg-cover bg-center p-6 md:pr-24 relative overflow-hidden font-sans bg-brand-text"
      style={{ backgroundImage: "url(/frontend-login-bg.png)" }}
    >
      <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-[0_0_50px_rgba(255,165,0,0.15)] border border-white/10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="grid place-items-center w-14 h-14 rounded-full bg-accent text-secondary-200 text-3xl border border-secondary-400/40 group-hover:scale-105 transition-transform">ॐ</div>
            <span className="mt-3 text-2xl font-serif font-bold text-white tracking-wide">MantraVanni</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary-300 mt-1">Sacred living</span>
          </Link>
          <h2 className="text-lg font-semibold text-white mt-5">Welcome Back</h2>
          <p className="text-sm text-gray-300 mt-1">Sign in to continue your spiritual journey</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex p-1 bg-black/30 rounded-xl mb-8 border border-white/5">
          <button
            onClick={() => setLoginType("mobile")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              loginType === "mobile" ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Phone size={16} /> Phone
          </button>
          <button
            onClick={() => setLoginType("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              loginType === "email" ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "text-gray-400 hover:text-white"
            }`}
          >
            <Mail size={16} /> Email
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-5">
          {loginType === "email" ? (
            <div className="space-y-5">
              <div>
                <label htmlFor="signin-identifier" className="block text-sm font-medium text-gray-300 mb-1.5">Email or Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="signin-identifier"
                    autoComplete="username"
                    placeholder="you@example.com"
                    className={inputCls}
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSignIn()}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="signin-password" className="block text-sm font-medium text-gray-300">Password</label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="signin-password"
                    autoComplete="current-password"
                    type="password"
                    placeholder="••••••••"
                    className={inputCls}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSignIn()}
                  />
                </div>
              </div>
              <button onClick={handleCustomSignIn} disabled={isSubmitting} className={`${primaryBtn} mt-2`}>
                {isSubmitting ? "Processing..." : "Sign In"}
                {!isSubmitting && <ChevronRight size={18} />}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label htmlFor="signin-mobile" className="block text-sm font-medium text-gray-300 mb-1.5">Mobile Number</label>
                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all bg-black/20 focus-within:bg-black/40">
                  <span className="flex items-center justify-center px-4 border-r border-white/10 text-primary-400 font-medium bg-black/20">+91</span>
                  <input
                    id="signin-mobile"
                    autoComplete="tel-national"
                    inputMode="numeric"
                    disabled={!!otpSessionId}
                    type="tel"
                    maxLength="10"
                    className="flex-1 w-full px-4 py-3 outline-none bg-transparent text-white placeholder-gray-500"
                    placeholder="Enter 10 digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === 'Enter' && !otpSessionId && handleSendOtp()}
                  />
                </div>
              </div>
              {!otpSessionId ? (
                <button onClick={handleSendOtp} disabled={isSubmitting || mobile.length !== 10} className={primaryBtn}>
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  {!isSubmitting && <ChevronRight size={18} />}
                </button>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 text-center">
                    Enter the {OTP_LENGTH}-digit OTP sent to +91 {mobile}
                  </label>
                  <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
                  <button onClick={handleVerifyOtp} disabled={isSubmitting || otp.length !== OTP_LENGTH} className={primaryBtn}>
                    {isSubmitting ? "Verifying..." : "Verify & Sign In"}
                    {!isSubmitting && <ChevronRight size={18} />}
                  </button>
                  <div className="flex justify-between text-xs text-gray-400">
                    <button type="button" onClick={handleSendOtp} disabled={isSubmitting} className="hover:text-white underline">Resend OTP</button>
                    <button type="button" onClick={() => { setOtpSessionId(null); setOtp(""); }} className="hover:text-white underline">Change number</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#14100E] text-gray-500 rounded-full border border-white/5">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-brand-bg/5 border border-white/10 text-white py-3.5 rounded-xl hover:bg-brand-bg/10 hover:border-white/20 transition-all active:scale-[0.98] font-medium shadow-sm disabled:opacity-50"
            >
              <FcGoogle size={22} />
              Continue with Google
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing you agree to our{" "}
          <Link to="/terms-and-conditions" className="underline hover:text-white">Terms</Link> and{" "}
          <Link to="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
        </p>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary-400 font-semibold hover:text-primary-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>

    </div>
  );
};

export default SignInPage;
