import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Phone, Lock, User, KeyRound, Fingerprint, Sparkles, ChevronRight } from "lucide-react";
import logo from "../../image/Logo.webp";

const SignInPage = () => {
  const [loginType, setLoginType] = useState("mobile");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    login,
    googleLogin,
    loginPhoneV1,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || 
                     location.state?.from || 
                     new URLSearchParams(location.search).get('redirect') || 
                     "/";

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

  /* ---------------- PHONE LOGIN V1 ---------------- */
  const handlePhoneLogin = async () => {
    if (mobile.length !== 10) {
      toast.error("Please enter a 10-digit number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginPhoneV1(`+91${mobile}`);
      toast.success(response.message || "Login successful");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Login failed");
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

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#fcfaff] font-inter">
      {/* Soft Theme Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Branding - Matching Site Logo Style */}
        <div className="text-center mb-8">
          <Link to="/">
            <div className="mx-auto mb-4 grid place-items-center w-16 h-16 rounded-full bg-[#a94217] text-[#fff1da] text-4xl">ॐ</div>
          </Link>
          <h1 className="text-3xl font-serif font-black tracking-tighter text-brand-text uppercase">
            PUJA <span className="text-[#a94217]">SAMAGRI</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2 italic">Premium Boutique</p>
        </div>

        {/* Elegant Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(106,46,159,0.08)] border border-primary-50 p-8 md:p-10 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-brand-text tracking-tight uppercase">Welcome Back</h2>
            <p className="text-gray-400 text-xs mt-1 font-medium italic">Login to explore your luxury wardrobe</p>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-4 bg-white border border-gray-200 py-3.5 rounded-2xl mb-8 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span className="text-[10px] font-black text-brand-text uppercase tracking-widest">Connect with Google</span>
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-primary-100"></div>
            <span className="text-[9px] font-black text-primary-300 tracking-[0.3em] uppercase">SECURE ENTRY</span>
            <div className="flex-1 h-px bg-primary-100"></div>
          </div>

          {/* Styled Tabs */}
          <div className="flex bg-primary-50 p-1 rounded-2xl mb-8 border border-primary-100">
            <button
              onClick={() => setLoginType("mobile")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginType === "mobile"
                  ? "bg-white text-[#6a2e9f] shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Phone Login
            </button>
            <button
              onClick={() => setLoginType("email")}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                loginType === "email"
                  ? "bg-white text-[#6a2e9f] shadow-md"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Email Login
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {loginType === "email" ? (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300" size={18} />
                  <input
                    placeholder="Email or Username"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-white focus:border-primary-200 outline-none transition-all placeholder-gray-300"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSignIn()}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-white focus:border-primary-200 outline-none transition-all placeholder-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSignIn()}
                  />
                </div>
                <div className="text-right">
                  <Link to="/forgot-password" size={18} className="text-[10px] font-black text-[#6a2e9f] hover:underline underline-offset-4 decoration-2 uppercase tracking-widest">
                    Forgot Password?
                  </Link>
                </div>
                <button
                  onClick={handleCustomSignIn}
                  disabled={isSubmitting}
                  className="w-full bg-[#6a2e9f] text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-100 hover:bg-[#5a258a] transition-all disabled:opacity-50"
                >
                  <span className="text-[11px]">{isSubmitting ? "Processing..." : "Sign In"}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4 border-r border-primary-100">
                    <Phone className="text-primary-300" size={18} />
                    <span className="text-gray-400 font-black text-sm">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength="10"
                    className="w-full pl-28 pr-6 py-4.5 bg-gray-50 border-2 border-transparent rounded-2xl text-base font-black text-brand-text tracking-widest focus:bg-white focus:border-primary-200 outline-none transition-all placeholder-gray-300"
                    placeholder="Mobile No"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === 'Enter' && handlePhoneLogin()}
                  />
                </div>
                <button
                  onClick={handlePhoneLogin}
                  disabled={isSubmitting || mobile.length !== 10}
                  className="w-full bg-gray-900 text-white py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
                >
                  <span className="text-[11px]">{isSubmitting ? "Verifying..." : "Sign In"}</span>
                  {!isSubmitting && <ChevronRight size={16} />}
                </button>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              New to the circle?{" "}
              <Link to="/signup" className="text-[#6a2e9f] font-black hover:underline underline-offset-4 decoration-2 ml-1 tracking-normal">
                Join Now
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-4 opacity-30">
           <Fingerprint size={20} className="text-primary-400" />
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">Secure Boutique Access</p>
        </div>
      </div>

      <ToastContainer 
        position="bottom-center" 
        autoClose={3000} 
        theme="light"
        toastClassName="rounded-xl font-bold shadow-xl border border-primary-50"
      />
    </div>
  );
};

export default SignInPage;
