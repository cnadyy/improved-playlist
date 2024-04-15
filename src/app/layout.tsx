"use client";

import GlobalWraps from "@/components/GlobalWraps";
import Loading from "@/components/Loading";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outfit } from "next/font/google";
import { Suspense, useState } from "react";

const outfit = Outfit({ subsets: ["latin"] });

function RootLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <html lang="en" style={{ scrollBehavior: "smooth" }}>
            <body className={outfit.className} style={{ margin: 0 }}>
                <QueryClientProvider client={queryClient}>
                    <GlobalWraps>{children}</GlobalWraps>
                </QueryClientProvider>
            </body>
        </html>
    );
}

export default RootLayout;
