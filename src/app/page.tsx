"use client";

import Link from "next/link";
import Unauthenticated from "./@unauthenticated/default";
import { isAuthenticated } from "@/api/util";
import { useEffect, useState } from "react";

export default function Home() {
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        isAuthenticated().then(setAuth);
    }, []);

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
