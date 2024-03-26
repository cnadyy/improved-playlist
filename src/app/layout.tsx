"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outfit } from "next/font/google";
import { usePathname } from "next/navigation";
import Script from "next/script";
import React, { createContext, useEffect, useState } from "react";

const outfit = Outfit({ subsets: ["latin"] });

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
  const [queryClient] = useState(() => new QueryClient());
  let exception = false;

  // check if authenticated
  useEffect(() => {
    if (window.localStorage.getItem("access_token")) setToken(true);
  }, []);

  // non guarded pages
  if (["/redirect", "/"].filter((s) => s == pathname).length) exception = true;

  return (
    <html lang="en" style={{ scrollBehavior: "smooth" }}>
      <head>
        <Script
          id="DragDropTouch"
          src="https://bernardo-castilho.github.io/DragDropTouch/DragDropTouch.js"
        />
      </head>
      <body className={outfit.className} style={{ margin: 0 }}>
        <QueryClientProvider client={queryClient}>
          <AuthenticatedContext.Provider value={isTokenSet}>
            {isTokenSet || exception ? children : unauthenticated}
          </AuthenticatedContext.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}

export { RootLayout as default, AuthenticatedContext };
