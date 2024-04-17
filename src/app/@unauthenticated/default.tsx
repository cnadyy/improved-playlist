"use client";

import authenticate from "@/api/spotify/authenticate";
import { isFirebaseAuthenticated, isSpotifyAuthenticated } from "@/api/util";
import { Auth } from "@/api/firebase/createApp";
import { sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";

enum sending {
    notSent,
    sending,
    sent,
}

const SpotifyButton = styled.div`
    background-color: limegreen;
    padding: 1rem;
    border-radius: 100px;
    color: white;
    cursor: pointer;
    &:hover {
        background-color: green;
    }
`;

export default function Unauthenticated() {
    const [spotify, setSpotify] = useState(false);
    const [firebase, setFirebase] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [emailSending, setEmailSending] = useState(sending.notSent);

    const sendLink = () => {
        setEmailSending(sending.sending);
        localStorage.setItem("firebaseAuthEmail", userEmail);
        Auth.onAuthStateChanged((a) => {
            console.log(a);
        });
        sendSignInLinkToEmail(Auth, userEmail, {
            url: `${window.location.origin}/redirectFirebase`,
            handleCodeInApp: true,
        })
            .then(() => setEmailSending(sending.sent))
            .catch((e) => console.error(e));
    };

    useEffect(() => {
        setSpotify(isSpotifyAuthenticated());
        isFirebaseAuthenticated().then(setFirebase);
    }, []);

    const emailState: () => string = () => {
        if (emailSending == sending.notSent) return "Email not sent";
        if (emailSending == sending.sending) return "Email sending";
        else return "Email sent";
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
            }}
        >
            <h2>You are not yet authenticated to use this appliaction</h2>
            <h3>Please authenticate Firebase and spotify seperately</h3>
            <SpotifyButton onClick={authenticate}>
                Click here to authenticate spotify.
                <span>{spotify ? " Spotify is authenticated." : ""}</span>
            </SpotifyButton>
            {firebase ? (
                <p>Firebase is authenticated.</p>
            ) : (
                <div style={{ marginTop: "1rem" }}>
                    <input
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <button onClick={sendLink}>
                        Send sign in link to email
                    </button>
                    <p>{emailState()}</p>
                </div>
            )}
        </div>
    );
}
