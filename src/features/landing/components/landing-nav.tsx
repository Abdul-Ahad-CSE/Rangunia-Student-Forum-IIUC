import * as React from "react";
import { auth } from "@/auth";
import { LandingNavClient } from "./landing-nav-client";
import type { Session } from "next-auth";

interface LandingNavProps {
  session?: Session | null;
}

async function LandingNavServer({ session: propSession }: LandingNavProps) {
  const session = propSession !== undefined ? propSession : await auth();
  return <LandingNavClient session={session} />;
}

export function LandingNav(props: LandingNavProps = {}) {
  if (props.session !== undefined) {
    return <LandingNavClient session={props.session} />;
  }

  return (
    <React.Suspense fallback={<LandingNavClient session={null} />}>
      <LandingNavServer {...props} />
    </React.Suspense>
  );
}
