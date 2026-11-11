"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Clock,
  GraduationCap,
  Briefcase,
  Shield,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { loginWithCredentialsAction } from "@/features/auth/actions/login-action";
import { toast } from "sonner";

type RoleOption = "student" | "alumni" | "executive" | "super_admin";

const ROLE_METADATA: Record<
  RoleOption,
  {
    title: string;
    badge: string;
    badgeColor: string;
    description: string;
    emailPlaceholder: string;
    registerText?: string;
    registerLink?: string;
    note?: string;
    icon: React.ElementType;
  }
> = {
  student: {
    title: "Student Portal Login",
    badge: "IIUC Enrolled Student",
    badgeColor: "border-emerald-500/30 bg-emerald-950/40 text-emerald-300",
    description: "Access your student profile, blood network status, and campus directory.",
    emailPlaceholder: "e.g. c213045@ugrad.iiuc.ac.bd or student@gmail.com",
    registerText: "Not registered yet? Register as Student",
    registerLink: "/register/student",
    icon: GraduationCap,
  },
  alumni: {
    title: "Alumni Portal Login",
    badge: "IIUC Alumni Graduate",
    badgeColor: "border-teal-500/30 bg-teal-950/40 text-teal-300",
    description: "Access alumni career networking, mentorship offerings, and forum updates.",
    emailPlaceholder: "e.g. alumni@company.com or name@mail.com",
    registerText: "Graduated from IIUC? Register as Alumni",
    registerLink: "/register/alumni",
    icon: Briefcase,
  },
  executive: {
    title: "Executive Admin Login",
    badge: "General Executive Council",
    badgeColor: "border-amber-500/30 bg-amber-950/40 text-amber-300",
    description: "Moderation access for appointed executive committee administrators.",
    emailPlaceholder: "e.g. executive@rsf.org or admin@gmail.com",
    registerText: "Appointed as an executive? Register as Admin",
    registerLink: "/admin/register",
    icon: ShieldCheck,
  },
  super_admin: {
    title: "Super Admin Governance",
    badge: "Root System Authority",
    badgeColor: "border-rose-500/30 bg-rose-950/40 text-rose-300",
    description: "Primary governance access to verify executives and manage platform permissions.",
    emailPlaceholder: "ranguniastudentsforum786@gmail.com",
    note: "Super Admin credentials bypass database registration and are authenticated strictly via secure environment governance.",
    icon: KeyRound,
  },
};

const ROLE_TO_LOGIN_TYPE: Record<RoleOption, "STUDENT" | "ALUMNI" | "ADMIN" | "SUPER_ADMIN"> = {
  student: "STUDENT",
  alumni: "ALUMNI",
  executive: "ADMIN",
  super_admin: "SUPER_ADMIN",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [activeRole, setActiveRole] = React.useState<RoleOption>("student");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const meta = ROLE_METADATA[activeRole];
  const RoleIcon = meta.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const loginType = ROLE_TO_LOGIN_TYPE[activeRole];
      const res = await loginWithCredentialsAction(email, password, loginType);

      if (!res?.success) {
        const errorText =
          res?.error || "Invalid credentials. Please verify your email and password.";

        if (
          errorText.toLowerCase().includes("waiting for approval") ||
          errorText.toLowerCase().includes("awaiting") ||
          errorText.toLowerCase().includes("pending")
        ) {
          const displayMsg =
            "Waiting for approval. You cannot log in until an executive verifies your account.";
          setErrorMessage(displayMsg);
          toast.error(displayMsg, { duration: 6000 });
          return;
        }

        if (errorText.toLowerCase().includes("rejected")) {
          const rejectMsg =
            "Registration request rejected. Your account was not approved by forum executives.";
          setErrorMessage(rejectMsg);
          toast.error(rejectMsg, { duration: 6000 });
          return;
        }

        setErrorMessage(errorText);
        toast.error(errorText);
        return;
      }

      // Safe destination redirect respecting callbackUrl
      const destination =
        callbackUrl && !callbackUrl.includes("/login")
          ? callbackUrl
          : res.redirectTo || "/profile";

      window.location.href = destination;
    } catch (err) {
      console.error("Login submission error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected network error occurred. Please try again.";

      if (
        message.toLowerCase().includes("waiting for approval") ||
        message.toLowerCase().includes("awaiting") ||
        message.toLowerCase().includes("pending")
      ) {
        const displayMsg =
          "Waiting for approval. You cannot log in until an executive verifies your account.";
        setErrorMessage(displayMsg);
        toast.error(displayMsg, { duration: 6000 });
      } else if (message.toLowerCase().includes("rejected")) {
        const rejectMsg =
          "Registration request rejected. Your account was not approved by forum executives.";
        setErrorMessage(rejectMsg);
        toast.error(rejectMsg, { duration: 6000 });
      } else {
        setErrorMessage(message);
        toast.error(message);
      }
    } finally {
      // Ensure loading state resets in all failure or completion scenarios
      setIsLoading(false);
    }
  };

  const isPendingApprovalError = Boolean(
    errorMessage &&
      (errorMessage.toLowerCase().includes("waiting for approval") ||
        errorMessage.toLowerCase().includes("awaiting") ||
        errorMessage.toLowerCase().includes("pending"))
  );

  return (
    <Card className="border border-white/10 bg-[#07130f]/80 backdrop-blur-xl text-white shadow-2xl">
      {/* Segmented Role Selector Header */}
      <div className="p-2 border-b border-white/5 bg-black/40">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-medium">
          {(["student", "alumni", "executive", "super_admin"] as RoleOption[]).map((role) => {
            const isSelected = activeRole === role;
            const rMeta = ROLE_METADATA[role];
            const Icon = rMeta.icon;
            return (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setActiveRole(role);
                  setErrorMessage(null);
                }}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg transition-all ${
                  isSelected
                    ? "bg-emerald-600/90 text-white shadow-sm font-semibold border border-emerald-400/30"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {role === "super_admin"
                    ? "Super Admin"
                    : role === "executive"
                    ? "Executive"
                    : role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <RoleIcon className="w-4 h-4 text-emerald-400" />
            <span>{meta.title}</span>
          </CardTitle>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${meta.badgeColor}`}>
            {meta.badge}
          </span>
        </div>
        <CardDescription className="text-xs text-zinc-400">
          {meta.description}
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

        {meta.note && (
          <div className="mb-4 p-3 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-200 text-xs">
            {meta.note}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="hidden"
            name="loginType"
            value={ROLE_TO_LOGIN_TYPE[activeRole]}
          />
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email Address</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              placeholder={meta.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs sm:text-sm"
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
              className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus-visible:border-emerald-500 text-xs sm:text-sm"
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
                  <span>Sign In as {meta.badge.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Dynamic Contextual Footer */}
        <div className="mt-6 pt-5 border-t border-white/5 text-center text-xs text-zinc-400 space-y-2">
          {meta.registerText && meta.registerLink ? (
            <p>
              <Link href={meta.registerLink} className="text-emerald-400 hover:underline font-semibold">
                {meta.registerText} →
              </Link>
            </p>
          ) : (
            <p className="text-[11px] text-zinc-500">
              Root administrative access is managed under strict environment variables.
            </p>
          )}

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <span>Need to register a different role?</span>
              <span className="text-emerald-400 underline">View all registration options</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#040907] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-lg w-full space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wider uppercase mb-6 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center justify-center p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-950/40 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white">
            Forum Access Portal
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm">
            Sign in to access your personal student profile, alumni network, or executive admin tools.
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
