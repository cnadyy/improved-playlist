"use client";

import { useSearchParams } from "next/navigation";
import CLIENT_ID from "../secrets";
import { useEffect, useState } from "react";

async function getToken(code: string) {
    // stored in the previous step
    const codeVerifier = window.localStorage.getItem("code_verifier");
    if (!codeVerifier) throw new Error("Code verifier not set");

    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: `${window.location.origin}/redirect`,
            code_verifier: codeVerifier,
        }),
    };

    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();
    if (!response.error) {
        localStorage.setItem("access_token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);
    } else throw new Error("Failed to authenticate");
}

export default function Redirect() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [noError, setNoError] = useState(true);

    useEffect(() => {
        if (code) {
            getToken(code)
                .then(() => (window.location.href = "/home"))
                .catch(() => setNoError(false));
        } else setNoError(false);
    }, [code]);

    return (
        <>
            {noError ? (
                <p>Authenticated! Loading....</p>
            ) : (
                <p> Failed. Please try again</p>
            )}
        </>
    );
}
