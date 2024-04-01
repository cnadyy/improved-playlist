"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

enum progress {
    failed,
    success,
    loading,
}

export default function Redirect() {
    const params = useSearchParams();
    const [isSuccessful, setIsSuccessful] = useState<progress>(
        progress.loading,
    );

    useEffect(() => {
        if (params.get("apiKey")) {
            localStorage.setItem(
                "firebaseAuthentication",
                window.location.href,
            );
            setIsSuccessful(progress.success);
        } else setIsSuccessful(progress.failed);
    }, []);

    const userMessage: (state: progress) => string = (state) => {
        if (state == progress.success)
            return "Accepted! Please close this window and return to where you submitted the link";
        else if (state == progress.failed)
            return "Unable to authenticate. Please try again";
        else return "Loading......";
    };

    return (
        <>
            <p>{userMessage(isSuccessful)}</p>
        </>
    );
}
