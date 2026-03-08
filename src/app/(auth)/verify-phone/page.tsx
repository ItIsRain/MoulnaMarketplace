"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Phone verification temporarily disabled — redirect to dashboard
export default function VerifyPhonePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
