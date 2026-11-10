import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Axios, { storeToken } from "../../utils/Axios";
import { User, Mail, Lock, Phone, Fingerprint, ChevronRight } from "lucide-react";

const SignupPage = () => {
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.userName) {
      toast.error("Email, username and password are required");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ Correct endpoint: /auth/customRegister (NOT /auth/register)
      const res = await Axios.post("/auth/customRegister", form, { withCredentials: true });

      // 🔑 Store token as Bearer fallback for cross-subdomain cookie blocking
      if (res.data?.token) storeToken(res.data.token);

      toast.success("Account created successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setIsSubmitting(true);
    try {
      await googleLogin();
      toast.success("Google signup successful");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.message || "Google signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-brand-bg font-sans">
      {/* Soft Theme Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="grid place-items-center w-16 h-16 rounded-full bg-accent text-secondary-200 text-4xl shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">ॐ</div>
            <h1 className="mt-3 text-3xl font-serif font-bold tracking-tight text-brand-text">MantraVanni</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-secondary-600 mt-1">Sacred living</p>
          </Link>
        </div>

        {/* Elegant Card */}
        <div className="bg-brand-bg rounded-[2.5rem] shadow-[0_20px_50px_rgba(139,30,30,0.10)] border border-primary-50 p-8 md:p-12 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-brand-text tracking-tight">Create Account</h2>
            <p className="text-gray-400 text-sm font-medium italic">Join the MantraVanni family</p>
          </div>

          <div className="space-y-8">
            {/* Social Signup */}
            <button
              onClick={handleGoogle}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-4 bg-brand-bg border border-gray-200 py-3.5 rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <FcGoogle size={20} />
              <span className="text-[10px] font-black text-brand-text uppercase tracking-widest">Sign Up with Google</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-primary-100"></div>
              <span className="text-[9px] font-black text-primary-300 uppercase tracking-[0.3em]">MANUAL REGISTRATION</span>
              <div className="flex-1 h-px bg-primary-100"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="userName"
                    type="text"
                    placeholder="Username"
                    value={form.userName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300 transition-colors group-focus-within:text-accent" size={20} />
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone No"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full pl-16 pr-6 py-4.5 bg-primary-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-brand-text focus:bg-brand-bg focus:border-primary-400 outline-none transition-all placeholder-gray-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-100 hover:bg-accent-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span className="text-[11px]">{isSubmitting ? "Creating Profile..." : "Complete Sign Up"}</span>
                {!isSubmitting && <ChevronRight size={18} />}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Already part of the family?{" "}
                <Link to="/signin" className="text-accent font-black hover:underline underline-offset-4 decoration-2 ml-2 tracking-normal">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-4 opacity-30">
           <Fingerprint size={20} className="text-primary-400" />
           <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">Secure Registration</p>
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

export default SignupPage;
