"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { registerForEventAction } from "../actions/event-actions";

interface EventRegisterButtonProps {
  eventId: string;
  registrationDeadline: Date | string;
  isLoggedIn: boolean;
  isRegistered: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function EventRegisterButton({
  eventId,
  registrationDeadline,
  isLoggedIn,
  isRegistered,
  size = "default",
  className,
}: EventRegisterButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const deadline = new Date(registrationDeadline);
  const isPastDeadline = new Date() > deadline;

  // Case 1: User has already registered
  if (isRegistered) {
    return (
      <Button
        type="button"
        size={size}
        disabled
        className={
          className ||
          "w-full sm:w-auto bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-semibold text-xs sm:text-sm cursor-default shadow-md shadow-emerald-950/50 gap-2"
        }
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>✓ You are registered</span>
      </Button>
    );
  }

  // Case 2: Deadline has passed
  if (isPastDeadline) {
    return (
      <Button
        type="button"
        size={size}
        disabled
        className={
          className ||
          "w-full sm:w-auto bg-zinc-900 border border-white/10 text-zinc-500 font-medium text-xs sm:text-sm cursor-not-allowed gap-2"
        }
      >
        <Clock className="w-4 h-4 text-zinc-500" />
        <span>Registration Closed</span>
      </Button>
    );
  }

  // Case 3: User is unauthenticated (Route to login with callbackUrl)
  if (!isLoggedIn) {
    return (
      <Link href={`/login?callbackUrl=/events/${eventId}`} className="w-full sm:w-auto">
        <Button
          type="button"
          size={size}
          className={
            className ||
            "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          }
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Register</span>
        </Button>
      </Link>
    );
  }

  // Case 4: Authenticated user registers for the event
  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const res = await registerForEventAction(eventId);
      if (res.success) {
        toast.success(res.message || "Registered for event!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to register.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      disabled={isSubmitting}
      onClick={handleRegister}
      className={
        className ||
        "w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
      }
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Registering...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Register for Event</span>
        </>
      )}
    </Button>
  );
}
