import React, { useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Unauthenticated from "@/app/@unauthenticated/default";
import checkIsAuthenticated from "@/api/checkIsAuthenticated";

export default function GlobalWraps({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const [isAuthenticated, setAuthenticated] = useState(false);
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
        checkIsAuthenticated().then(setAuthenticated);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {isAuthenticated || exception ? children : <Unauthenticated />}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
