import React, { useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Unauthenticated from "@/app/@unauthenticated/default";
import { isAuthenticated } from "@/api/util";
import PlayerInfo from "@/components/player/PlayerInfo";

export default function GlobalWraps({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const [authBool, setAuthBool] = useState(false);
    const [queryClient] = useState(() => new QueryClient());
    const pathname = usePathname();

    // non guarded pages
    let exception = false;
    if (
        ["/redirect", "/", "/redirectFirebase"].filter((s) => s == pathname)
            .length
    )
        exception = true;

    // check if authenticated
    useEffect(() => {
        isAuthenticated().then((a) => {
            setAuthBool(a);
            if (!a) console.error("Not authenticated");
        });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {authBool || exception ? children : <Unauthenticated />}
            {authBool && (
                <>
                    <div style={{ marginBottom: "6rem" }}></div>
                    <PlayerInfo />
                </>
            )}
            <ReactQueryDevtools
                buttonPosition="top-left"
                initialIsOpen={false}
            />
        </QueryClientProvider>
    );
}
