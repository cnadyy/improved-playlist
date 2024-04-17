"use client";

import { Auth } from "@/api/firebase/createApp";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

enum progress {
    failed,
    success,
    loading,
}

export default function Redirect() {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState<progress>(
        progress.loading,
    );
    const ref = useRef<HTMLInputElement | null>(null);

    // listen for authentication changes in other windows
    function handleSignIn(email?: string) {
        if (email && isSignInWithEmailLink(Auth, window.location.href)) {
            signInWithEmailLink(Auth, email, window.location.href)
                .then(() => {
                    if (localStorage.getItem("firebaseAuthEmail")) {
                        localStorage.removeItem("firebaseAuthEmail");
                        setIsSuccessful(progress.success);
                    } else {
                        router.push("/");
                    }
                })
                .catch((e) => {
                    console.error(e);
                    setIsSuccessful(progress.failed);
                });
        }
    }

    useEffect(() => {
        handleSignIn(localStorage.getItem("firebaseAuthEmail") as string);
    }, []);

    const userMessage: (state: progress) => string = (state) => {
        if (state == progress.success)
            return "Accepted! Please close this window and return to where you submitted the link";
        else if (state == progress.failed)
            return "Unable to authenticate. Please try again";
        else return "Loading......";
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            {
                <>
                    <input ref={ref}></input>
                    <div
                        onClick={() => {
                            handleSignIn(ref.current?.value);
                        }}
                    >
                        Sign in
                    </div>
                </>
            }
            <p>{userMessage(isSuccessful)}</p>
        </div>
    );
}
