import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Clock,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // ---------------------------------------------------
  // 1. SIGN IN ACTION
  // ---------------------------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResetMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      console.error("Admin login error:", err);

      switch (err?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Invalid email address or password.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid administrator email address.");
          break;
        case "auth/user-disabled":
          setError("This administrator account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait a moment and retry.");
          break;
        case "auth/network-request-failed":
          setError("Network connection failed. Check your internet.");
          break;
        default:
          setError("Unable to sign in right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // 2. PASSWORD RESET ACTION
  // ---------------------------------------------------
  const handlePasswordReset = async () => {
    setError("");
    setResetMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Enter your administrator email address first.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setResetMessage("Reset instructions have been dispatched to your inbox.");
    } catch (err) {
      console.error("Password reset error:", err);

      switch (err?.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setError("No administrator account exists with this email.");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please wait a few minutes.");
          break;
        default:
          setError("Failed to send reset email. Try again later.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="h-screen h-dvh w-full overflow-hidden bg-[#f1f5f9] flex items-center justify-center p-3 sm:p-5 font-sans antialiased selection:bg-[#1f9b90] selection:text-white">
      <div className="w-full max-w-5xl h-full max-h-[640px] bg-white sm:rounded-2xl overflow-hidden shadow-xl shadow-slate-300/30 grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80">
        
        {/* ===================================================
            LEFT HALF: COMPACT BRANDING PANEL (7 cols)
        =================================================== */}
        <section className="relative hidden lg:flex lg:col-span-7 flex-col justify-between overflow-hidden bg-[#10243e] p-7 xl:p-9 text-white">
          {/* Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#1f9b90]/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#f6ac42]/15 blur-3xl"
          />

          {/* Top Brand Identity */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-md shrink-0">
              <img
                src="/logo.jpg"
                alt="Sai Brindavan Hospital"
                className="h-full w-full rounded-lg object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-white leading-tight">
                Sai Brindavan
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#f6ac42]">
                Healthcare Center
              </p>
            </div>
          </div>

          {/* Middle Billboard */}
          <div className="relative z-10 max-w-md space-y-3.5 my-auto py-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/30 bg-teal-500/10 px-3 py-1 text-[11px] font-semibold text-teal-200">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1f9b90]" />
              <span>Administrative Operations Console</span>
            </div>

            <h1 className="text-2xl xl:text-3xl font-extrabold leading-snug text-white tracking-tight">
              Secure Control for Hospital Clinical Management.
            </h1>

            <p className="text-xs leading-relaxed text-slate-300">
              Manage doctor directories, OPD consultation hours, emergency schedules, published medical blogs, and patient knowledge resources.
            </p>

            {/* Quick Facility Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#f6ac42]">
                  <Building2 className="h-3 w-3" />
                  <span>Facility</span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-white">
                  Sagara, Karnataka
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  <Clock className="h-3 w-3" />
                  <span>Trauma & ICU</span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-white">
                  24/7 Casualty Support
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-400 border-t border-white/10 pt-3">
            <LockKeyhole className="h-3 w-3 text-[#1f9b90]" />
            <span>Authorized hospital personnel access only · Session encrypted</span>
          </div>
        </section>

        {/* ===================================================
            RIGHT HALF: COMPACT LOGIN WORKBENCH (5 cols)
        =================================================== */}
        <section className="lg:col-span-5 flex flex-col justify-center bg-white px-5 sm:px-8 lg:px-9 h-full">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-sm mx-auto space-y-4"
          >
            {/* Mobile Header Branding */}
            <div className="flex items-center gap-2.5 lg:hidden pb-2.5 border-b border-slate-100">
              <div className="h-9 w-9 rounded-lg border border-slate-200 bg-white p-1 shadow-2xs shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Sai Brindavan"
                  className="h-full w-full rounded-md object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1a365d] leading-none">
                  Sai Brindavan
                </p>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#1f9b90] mt-0.5">
                  Healthcare Admin
                </p>
              </div>
            </div>

            {/* Portal Title */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1f9b90]">
                Admin Authentication
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a365d] tracking-tight">
                Sign in to Console
              </h2>
              <p className="text-xs text-slate-500">
                Enter your administrator credentials to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="flex items-start justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800 shadow-2xs"
              >
                <div className="flex items-start gap-1.5 min-w-0">
                  <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-tight">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-700 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Reset Success Message */}
            {resetMessage && (
              <div
                role="status"
                className="flex items-start justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 shadow-2xs"
              >
                <div className="flex items-start gap-1.5 min-w-0">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="font-semibold leading-tight">{resetMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResetMessage("")}
                  className="text-emerald-400 hover:text-emerald-700 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Address */}
                <div>
                    <label
                    htmlFor="admin-email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                    Administrator Email
                    </label>
                    <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <Mail className="h-4 w-4" />
                    </div>
                    <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setResetMessage("");
                        }}
                        placeholder="admin@saibrindavan.com"
                        autoComplete="email"
                        disabled={loading}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15 disabled:bg-slate-100 disabled:text-slate-400"
                        required
                    />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                    <label
                        htmlFor="admin-password"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                        Password
                    </label>
                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={resetLoading || loading || !email.trim()}
                        className="text-xs font-bold text-[#1f9b90] transition-colors hover:text-[#178077] hover:underline disabled:opacity-40 disabled:hover:no-underline"
                    >
                        {resetLoading ? "Sending..." : "Forgot password?"}
                    </button>
                    </div>

                    <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <LockKeyhole className="h-4 w-4" />
                    </div>
                    <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                        }}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        disabled={loading}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-11 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#1f9b90] focus:bg-white focus:ring-2 focus:ring-[#1f9b90]/15 disabled:bg-slate-100 disabled:text-slate-400"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition-colors hover:text-slate-700"
                    >
                        {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                        ) : (
                        <Eye className="h-4 w-4" />
                        )}
                    </button>
                    </div>
                </div>

                {/* Submit CTA */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#1f9b90] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#1a365d]/10 transition-all hover:opacity-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                    </>
                    ) : (
                    <>
                        <span>Sign In to Console</span>
                        <ArrowRight className="h-4 w-4" />
                    </>
                    )}
                </button>
                </form>

            {/* Subtle Credential Footer */}
            <p className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
              Sai Brindavan Healthcare Center · Sagara
            </p>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

export default AdminLogin;