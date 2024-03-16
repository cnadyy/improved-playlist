"use client";

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const AuthenticatedContext = createContext(false);

function RootLayout({
  children,
  unauthenticated,
}: {
  children: React.ReactNode;
  unauthenticated: React.ReactNode;
}) {
  const [isTokenSet, setToken] = useState(false);
  const pathname = usePathname();
  let exception = false;

  // check if authenticated
  useEffect(() => {
    if (window.localStorage.getItem("access_token")) setToken(true);
  }, []);

  // non guarded pages
  if (["/redirect", "/"].filter((s) => s == pathname).length) exception = true;

  return (
    <html lang="en" style={{scrollBehavior: "smooth"}}>
      <body className={inter.className}>
        <AuthenticatedContext.Provider value={isTokenSet}>
          {isTokenSet || exception ? children : unauthenticated}
        </AuthenticatedContext.Provider>
      </body>
    </html>
  );
}

export { RootLayout as default, AuthenticatedContext };
