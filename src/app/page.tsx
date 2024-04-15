"use client";

import Link from "next/link";

export default function Home() {
    return (
        <div>
            <p>This is the home page</p>
            <p>One day this might look pretty</p>
            <Link href="/test">This goes over to test</Link>
        </div>
    );
}
