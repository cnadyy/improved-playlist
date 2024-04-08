"use client";

import GlobalWraps from "@/components/GlobalWraps";
import PlayerInfo from "@/components/player/PlayerInfo";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" style={{ scrollBehavior: "smooth" }}>
            <body className={outfit.className} style={{ margin: 0 }}>
                <GlobalWraps>{children}</GlobalWraps>
            </body>
        </html>
    );
}

export default RootLayout;
