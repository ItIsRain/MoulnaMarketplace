"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Smartphone, ArrowLeft, CheckCircle, RefreshCw,
  Shield, Sparkles
} from "lucide-react";

export default function VerifyPhonePage() {
  const [code, setCode] = React.useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsVerifying(false);
    setIsVerified(true);
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const isCodeComplete = code.every(digit => digit !== "");

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="w-full max-w-md p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Phone Verified!</h1>
            <p className="text-muted-foreground mb-6">
              Your phone number has been successfully verified.
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-moulna-gold" />
              <span className="font-medium text-moulna-gold">+100 XP earned!</span>
            </div>
            <Button className="w-full bg-moulna-gold hover:bg-moulna-gold-dark" asChild>
              <Link href="/onboarding">
                Continue to Onboarding
              </Link>
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-muted/30 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-moulna-gold/10 flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-moulna-gold" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Verify Your Phone</h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium">+971 50 *** ***7</p>
          </div>

          {/* Code Input */}
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  "w-12 h-14 text-center text-2xl font-bold",
                  digit && "border-moulna-gold"
                )}
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={!isCodeComplete || isVerifying}
            className="w-full bg-moulna-gold hover:bg-moulna-gold-dark mb-4"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 me-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-sm text-moulna-gold hover:underline"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in <span className="font-medium">{countdown}s</span>
              </p>
            )}
          </div>

          {/* Security Note */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Why verify?</p>
                <p className="text-xs text-muted-foreground">
                  Phone verification helps secure your account and enables
                  features like inquiry notifications and two-factor authentication.
                </p>
              </div>
            </div>
          </div>

          {/* XP Badge */}
          <div className="mt-4 text-center">
            <Badge className="bg-moulna-gold/10 text-moulna-gold border-moulna-gold/30">
              <Sparkles className="w-3 h-3 me-1" />
              +100 XP for verification
            </Badge>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
