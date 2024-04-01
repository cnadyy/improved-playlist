"use client";

import Link from "next/link";
import Unauthenticated from "./@unauthenticated/default";
import checkIsAuthenticated from "@/api/checkIsAuthenticated";
import { useEffect, useState } from "react";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkIsAuthenticated().then(setIsAuthenticated);
    }, []);

    return (
        <div>
            <p>This is the home page</p>
            <p>One day this might look pretty</p>
            {isAuthenticated ? (
                <Link href="/test">This goes over to test</Link>
            ) : (
                <Unauthenticated />
            )}
        </div>
    );
}
