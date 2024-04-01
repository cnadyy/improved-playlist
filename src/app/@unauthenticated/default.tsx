"use client";

import authenticate from "@/api/authenticate";
import {
    isFirebaseAuthenticated,
    isSpotifyAuthenticated,
} from "@/api/checkIsAuthenticated";
import { Auth } from "@/api/firebase/createApp";
import { sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { useEffect, useState } from "react";

enum sending {
    notSent,
    sending,
    sent,
}

export default function unauthenticated() {
    const [spotify, setSpotify] = useState(false);
    const [firebase, setFirebase] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [emailSending, setEmailSending] = useState(sending.notSent);
    const [error, setError] = useState("");

    const sendLink = () => {
        setEmailSending(sending.sending);
        localStorage.setItem("firebaseAuthentication", "");
        localStorage.setItem("firebaseAuthEmail", userEmail);
        sendSignInLinkToEmail(Auth, userEmail, {
            url: "http://localhost:3000/redirectFirebase",
            handleCodeInApp: true,
        }).then(() => setEmailSending(sending.sent));
    };

    useEffect(() => {
        setSpotify(isSpotifyAuthenticated());
        isFirebaseAuthenticated().then(setFirebase);
    }, []);

    // listen for authentication changes in other windows
    useEffect(() => {
        const handleChange = () => {
            const key = localStorage.getItem(
                "firebaseAuthentication",
            ) as string;
            const email = localStorage.getItem("firebaseAuthEmail") as string;
            if (key && email)
                signInWithEmailLink(Auth, email, key)
                    .then(() => isFirebaseAuthenticated().then(setFirebase))
                    .then(() => {
                        localStorage.setItem("firebaseAuthentication", "");
                        localStorage.setItem("firebaseAuthEmail", "");
                    })
                    .catch((e) => setError(e));
        };

        window.addEventListener("storage", handleChange);
        return () => window.removeEventListener("storage", handleChange);
    }, []);

    const emailState: (state: sending) => string = (state) => {
        if (emailSending == sending.notSent) return "Email not sent";
        if (emailSending == sending.sending) return "Email sending";
        else return "Email sent";
    };

    return (
        <div>
            <h2>You are not yet authenticated to use this appliaction</h2>
            <h3>Please authenticate Firebase and spotify seperately</h3>
            <p>
                Click{" "}
                <a
                    style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                    onClick={authenticate}
                >
                    here
                </a>{" "}
                to authenticate spotify.
                <span>{spotify ? " Spotify is authenticated." : ""}</span>
            </p>
            <input
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
            <button onClick={sendLink}>Send sign in link to email</button>
            <p>{emailState(emailSending)}</p>
            <p>{firebase ? " Firebase is authenticated." : ""}</p>
            <p>{error ? error + ". Refresh to try again." : ""}</p>
        </div>
    );
}
