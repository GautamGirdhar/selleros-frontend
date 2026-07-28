"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

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
  const [showPassword, setShowPassword] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (codeResponse) => {
      try {
        await authService.googleLogin(codeResponse.code);

        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google Login Failed");
      }
    },

    onError: () => {
      setError("Google Login Failed");
    },
  });

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
    // const payload = isLogin
    //   ? {
    //       username: values.get("username"),
    //       password: values.get("password"),
    //     }
    //   : {
    //       full_name: values.get("full_name"),
    //       email: values.get("email"),
    //       phone_number: values.get("phone_number"),
    //       password: values.get("password"),
    //       verification_channel: "email",
    //     };

    try {
      if (isLogin) {
        await authService.login({
          username: String(values.get("username")),
          password: String(values.get("password")),
        });

        router.push("/dashboard");
        return;
      }

      await authService.register({
        full_name: String(values.get("full_name")),
        email: String(values.get("email")),
        phone_number: String(values.get("phone_number")),
        password: String(values.get("password")),
      });

      setIdentifier(String(values.get("email")));

      setOtp(["", "", "", "", "", ""]);

      setTimer(30);

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
    setLoading(true);

    setError("");

    try {
      await authService.verifyOTP({
        identifier,

        code: otp.join(""),
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    setError("");
    setLoading(true);
    try {
      const response = await authService.resendOTP(identifier);
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      inputRefs.current[0]?.focus();
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
    <main className="grid h-screen overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative flex flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-40 border-primary/20" />
        <div className="relative text-xl font-bold tracking-tight">
          seller<span className="text-primary-light">os</span>
        </div>
        <div className="relative my-auto max-w-md">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
            AI seller operating system
          </p>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight">
            Make every product listing look brand-ready.
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/70">
            Generate catalogue images, combo shots, and marketplace-ready
            exports from one workspace.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-surface/10 bg-primary-foreground/5 p-3">
            <strong className="block text-primary-light">10 credits</strong>
            <span className="text-primary-foreground/60">Free to start</span>
          </div>
          <div className="rounded-2xl border border-surface/10 bg-rimary-foreground/5 p-3">
            <strong className="block text-primary-light">3 marketplaces</strong>
            <span className="text-primary-foreground/60">Ready to list</span>
          </div>
        </div>
      </section>
      <section className="flex h-screen justify-center overflow-y-auto px-8 py-10">
        <div className="w-full my-auto max-w-110">
          <div className="mb-11 flex items-center justify-between lg:hidden">
            <span className="text-xl font-bold tracking-tight">
              seller<span className="text-primary">os</span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              AI seller workspace
            </span>
          </div>

          {step === "auth" ? (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-primary">
                  Welcome to SellerOS
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {isLogin ? "Sign in to your account" : "Create your account"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isLogin
                    ? "Continue creating catalogues, images, and listings."
                    : "Your account starts with 10 credits to create your first product visuals."}
                </p>
              </div>

              <div className="mb-7 grid grid-cols-2 rounded-2xl bg-muted p-1">
                <button
                  type="button"
                  onClick={() => changeMode("login")}
                  className={`rounded-2xl py-2.5 text-sm font-semibold transition ${isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => changeMode("register")}
                  className={`rounded-2xl py-2.5 text-sm font-semibold transition ${!isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  Create account
                </button>
              </div>

              <div className="mt-8 space-y-5">
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  className="
flex
w-full
items-center
justify-center
gap-3
rounded-xl
border
border-border
bg-card
py-3.5
font-medium
shadow-sm
transition-all
hover:border-primary
hover:bg-muted
hover:shadow-md
"
                >
                  <FcGoogle className="text-2xl" />
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-default" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className=" px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>
              </div>

              <form className="space-y-5 min-h-107.5" onSubmit={submit}>
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
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      autoComplete={
                        isLogin ? "current-password" : "new-password"
                      }
                      minLength={8}
                      className="pr-12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-secondary hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <p
                    className="rounded-2xl border border-destructive bg-destructive-foreground px-3.5 py-3 text-sm text-desructive"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="
    w-full
    rounded-xl
    bg-primary
    py-6
    text-md
    font-semibold
    text-primary-foreground
    shadow-sm
    transition-all
    hover:bg-primary/90
    hover:shadow-md
  "
                >
                  {loading
                    ? "Please wait…"
                    : isLogin
                      ? "Sign in to SellerOS"
                      : "Get 10 free credits"}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-sm font-semibold text-primary">
                  Verify your email
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  Enter your code
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">
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
                    className="h-14 w-14 rounded-2xl border border-input bg-background text-center text-xl outline-none focus:ring-2 focus:ring-ring"
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                  />
                ))}
              </div>

              {error && (
                <p
                  className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
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
                  <p className="text-sm text-muted-foreground">
                    Resend code in {timer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={loading}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button
                type="button"
                className="mt-8 w-full text-center text-sm text-muted-foreground hover:underline"
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
