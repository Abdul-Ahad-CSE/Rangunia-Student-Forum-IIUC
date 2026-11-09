"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { loginWithCredentialsAction } from "@/features/auth/actions/login-action";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await loginWithCredentialsAction(email, password);

      if (!res.success) {
        setErrorMessage(res.error || "Authentication failed.");
        setIsLoading(false);
      } else {
        const destination = callbackUrl || res.redirectTo || "/admin/dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected network error occurred.");
      setIsLoading(false);
    }
  };

  const isPendingApprovalError =
    errorMessage === "Your account is awaiting Super Admin approval.";

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-2xl">
      <CardHeader className="border-b border-white/5 pb-4">
        <CardTitle className="text-lg font-bold text-white">Sign In</CardTitle>
        <CardDescription className="text-xs text-zinc-400">
          Access the RSF Management & Moderation console.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Error Notifications */}
        {errorMessage && (
          <div
            className={`mb-5 p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 ${
              isPendingApprovalError
                ? "border-amber-500/40 bg-amber-950/40 text-amber-200"
                : "border-destructive/40 bg-destructive/10 text-rose-300"
            }`}
          >
            {isPendingApprovalError ? (
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {isPendingApprovalError ? "Account Under Review" : "Authentication Denied"}
              </p>
              <p className="text-xs leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email Address</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="admin@rsf.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Password</span>
            </Label>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all hover:scale-[1.01]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Sign In to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-zinc-400 space-y-2">
          <p>
            Appointed as an executive member?{" "}
            <Link href="/admin/register" className="text-emerald-400 hover:underline font-semibold">
              Register as Admin
            </Link>
          </p>
          <p className="text-[11px] text-zinc-500">
            Super Admin credentials are authenticated strictly via secure environment governance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#040907] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-3 transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="inline-flex items-center justify-center p-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-white">
            Administration Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Sign in with Super Admin credentials or an approved Executive account.
          </p>
        </div>

        <React.Suspense
          fallback={
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
            </div>
          }
        >
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  );
}
