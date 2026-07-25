"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "register";
type Step = "auth" | "otp";

const RESEND_COOLDOWN = 30;

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("auth");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isLogin = mode === "login";

  // OTP-specific state
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const values = new FormData(event.currentTarget);
    const payload = isLogin
      ? {
          username: values.get("username"),
          password: values.get("password"),
        }
      : {
          full_name: values.get("full_name"),
          email: values.get("email"),
          phone_number: values.get("phone_number"),
          password: values.get("password"),
          verification_channel: "email",
        };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          data.message || "Something went wrong. Please try again.",
        );

      if (isLogin) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const emailValue = values.get("email");
      setIdentifier(typeof emailValue === "string" ? emailValue : "");
      setOtp(["", "", "", "", "", ""]);
      setTimer(RESEND_COOLDOWN);
      setStep("otp");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(value: string, index: number) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleBackspace(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function verifyOTP() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          verification_channel: "email",
          code: otp.join(""),
        }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          data.message || "That code didn't work. Please try again.",
        );

      router.push("/dashboard");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, verification_channel: "EMAIL" }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok)
        throw new Error(
          data.message || "Couldn't resend the code. Please try again.",
        );
      setOtp(["", "", "", "", "", ""]);
      setTimer(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setStep("auth");
    setError("");
    setOtp(["", "", "", "", "", ""]);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#1e4d32] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#c7e36b]/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-[40px] border-[#d7f27e]/20" />
        <div className="relative text-xl font-bold tracking-tight">
          seller<span className="text-[#d7f27e]">os</span>
        </div>
        <div className="relative my-auto max-w-md">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#d7f27e]">
            AI seller operating system
          </p>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight">
            Make every product listing look brand-ready.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Generate catalogue images, combo shots, and marketplace-ready
            exports from one workspace.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <strong className="block text-[#d7f27e]">10 credits</strong>
            <span className="text-white/60">Free to start</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <strong className="block text-[#d7f27e]">3 marketplaces</strong>
            <span className="text-white/60">Ready to list</span>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-11 flex items-center justify-between lg:hidden">
            <span className="text-xl font-bold tracking-tight">
              seller<span className="text-[#4f8a60]">os</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b746d]">
              AI seller workspace
            </span>
          </div>

          {step === "auth" ? (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#4f8a60]">
                  Welcome to SellerOS
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172118]">
                  {isLogin ? "Sign in to your account" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#69736b]">
                  {isLogin
                    ? "Continue creating catalogues, images, and listings."
                    : "Your account starts with 10 credits to create your first product visuals."}
                </p>
              </div>

              <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#e9ede8] p-1">
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className={`rounded-[9px] py-2.5 text-sm font-semibold transition ${isLogin ? "bg-white text-[#172118] shadow-sm" : "text-[#6a746b]"}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                  className={`rounded-[9px] py-2.5 text-sm font-semibold transition ${!isLogin ? "bg-white text-[#172118] shadow-sm" : "text-[#6a746b]"}`}
                >
                  Create account
                </button>
              </div>

              <form className="space-y-5" onSubmit={submit}>
                {!isLogin && (
                  <Field
                    id="full_name"
                    label="Full name"
                    placeholder="Aarav Sharma"
                    autoComplete="name"
                  />
                )}
                {isLogin ? (
                  <Field
                    id="username"
                    label="Email or phone number"
                    placeholder="you@company.com"
                    autoComplete="username"
                  />
                ) : (
                  <>
                    <Field
                      id="email"
                      label="Email address"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                    <Field
                      id="phone_number"
                      label="Phone number"
                      type="tel"
                      placeholder="+91"
                      autoComplete="tel"
                    />
                  </>
                )}
                <Field
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  minLength={8}
                />
                {error && (
                  <p
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Please wait…"
                    : isLogin
                      ? "Sign in to SellerOS"
                      : "Get 10 free credits"}
                </Button>
              </form>
              <p className="mt-7 text-center text-xs leading-5 text-[#7a837b]">
                By continuing, you agree to SellerOS&apos;s Terms of Service and
                Privacy Policy.
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#4f8a60]">
                  Verify your email
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#172118]">
                  Enter your code
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#69736b]">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-[#172118]">
                    {identifier}
                  </span>
                  . Enter it below to activate your account.
                </p>
              </div>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={digit}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-14 w-14 rounded-md border border-input bg-background text-center text-xl outline-none focus:ring-2 focus:ring-ring"
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                  />
                ))}
              </div>

              {error && (
                <p
                  className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                className="mt-6 w-full"
                disabled={loading || otp.some((d) => !d)}
                onClick={verifyOTP}
              >
                {loading ? "Verifying…" : "Verify OTP"}
              </Button>

              <div className="mt-6 text-center">
                {timer > 0 ? (
                  <p className="text-sm text-[#69736b]">
                    Resend code in {timer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={loading}
                    className="text-sm font-medium text-[#4f8a60] hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button
                type="button"
                className="mt-8 w-full text-center text-sm text-[#69736b] hover:underline"
                onClick={() => {
                  setStep("auth");
                  setOtp(["", "", "", "", "", ""]);
                }}
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  ...props
}: {
  id: string;
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} required {...props} />
    </div>
  );
}
