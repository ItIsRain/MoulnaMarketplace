"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle, RefreshCw, Sparkles, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [error, setError] = React.useState("");
  const [hasSentInitial, setHasSentInitial] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get("email") || user?.email || "";

  // Code is already sent by the register route.
  // Start the resend cooldown so user doesn't double-send immediately.
  React.useEffect(() => {
    if (email && !hasSentInitial) {
      setHasSentInitial(true);
      setResendCooldown(60);
    }
  }, [email, hasSentInitial]);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendVerificationCode = async () => {
    setIsSending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send verification code");
      } else {
        setResendCooldown(60);
      }
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newCode.every(c => c) && newCode.join("").length === 6) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setIsVerified(true);
      }
    } catch {
      setError("Verification failed. Please try again.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    sendVerificationCode();
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/moulna-logo.svg"
              alt="Moulna"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {!isVerified ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-moulna-gold/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-moulna-gold" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-center">Verify your email</h1>
              <p className="text-muted-foreground mb-8 text-center">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email || "your email"}</span>
              </p>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm mb-6 text-center">
                  {error}
                </div>
              )}

              {/* Code Input */}
              <div className="flex justify-center gap-3 mb-8">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInput(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>

              <Button
                className="w-full bg-moulna-gold hover:bg-moulna-gold-dark mb-4"
                disabled={isLoading || code.some(c => !c)}
                onClick={() => handleVerify(code.join(""))}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verifying...</>
                ) : (
                  "Verify Email"
                )}
              </Button>

              <div className="text-center">
                {resendCooldown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Resend code in {resendCooldown}s
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isSending}
                    className="text-sm text-moulna-gold hover:underline inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Resend code
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
              {user?.role === "seller" ? (
                <>
                  <p className="text-muted-foreground mb-8">
                    Your email is verified! One more step — verify your identity to start listing on Moulna.
                  </p>
                  <Button
                    onClick={() => router.push("/seller")}
                    className="w-full bg-moulna-gold hover:bg-moulna-gold-dark"
                  >
                    Continue to ID Verification
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-8">
                    Your email has been successfully verified. You can now access all features.
                  </p>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-moulna-gold hover:bg-moulna-gold-dark"
                  >
                    Go to Dashboard
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-moulna-charcoal to-moulna-charcoal-dark items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-moulna-gold" />
          <h2 className="text-3xl font-display font-bold mb-4">
            Almost there!
          </h2>
          <p className="text-white/70">
            Verify your email to unlock the full Moulna experience including rewards, deals, and exclusive offers.
          </p>
        </div>
      </div>
    </div>
  );
}
