"use client";

import GlobalWraps from "@/components/GlobalWraps";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outfit } from "next/font/google";
import { useState } from "react";
import "../css/global.css";

const outfit = Outfit({ subsets: ["latin"] });

function RootLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
        <html lang="en" style={{ scrollBehavior: "smooth" }}>
            <head>
                <title>Improved spotify playlists</title>
                <meta
                    name="description"
                    content="The ability to create folders to organise your Spotify Playlists, which helps you to enable, disable and play Spotify Playlists with ease."
                />
            </head>
            <body className={outfit.className} style={{ margin: 0 }}>
                <QueryClientProvider client={queryClient}>
                    <GlobalWraps>{children}</GlobalWraps>
                </QueryClientProvider>
            </body>
        </html>
    );
}

export default RootLayout;
