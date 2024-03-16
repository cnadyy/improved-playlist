"use client";

import Link from "next/link";
import React, { useContext, useSyncExternalStore } from "react";
import Unauthenticated from "./@unauthenticated/default";
import { AuthenticatedContext } from "./layout";

export default function Home() {
  const auth = useContext(AuthenticatedContext);

  return (
    <div>
      <p>This is the home page</p>
      <p>One day this might look pretty</p>
      {auth ? (
        <Link href="/test">This goes over to test</Link>
      ) : (
        <Unauthenticated />
      )}
    </div>
  );
}
