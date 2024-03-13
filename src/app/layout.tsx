'use client'

import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({children, unauthenticated}: { children: React.ReactNode, unauthenticated: React.ReactNode}) {
  const [isTokenSet, setToken] = useState(false);
  const pathname = usePathname();
  let exception = false;

  // check if authenticated
  useEffect(() => {if (window.localStorage.getItem('access_token')) setToken(true)});

  // non guarded pages
  if (["/redirect"].filter(s => s == pathname).length) exception = true;
  console.log("layout is rendering")

  return (
    <html lang="en">
      <body className={inter.className}>
        {isTokenSet || exception ? children : unauthenticated}
      </body>
    </html>
  );
}
