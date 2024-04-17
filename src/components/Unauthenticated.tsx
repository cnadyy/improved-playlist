import authenticate from "@/api/spotify/authenticate";
import { isFirebaseAuthenticated, isSpotifyAuthenticated } from "@/api/util";
import { Auth } from "@/api/firebase/createApp";
import { sendSignInLinkToEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import setUser from "@/api/firebase/set/user";

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

export default function Unauthenticated({ refetch }: { refetch: () => void }) {
    const [spotify, setSpotify] = useState(false);
    const [firebase, setFirebase] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [emailSending, setEmailSending] = useState(sending.notSent);
    const [name, setName] = useState("");

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

    function registerUser() {
        setUser({
            uuid: Auth.currentUser!.uid,
            name: name,
            pinned: [],
        }).then(() => refetch());
    }

    useEffect(() => {
        setSpotify(isSpotifyAuthenticated());
        isFirebaseAuthenticated().then(setFirebase);
    }, []);

    const emailState: () => string = () => {
        if (emailSending == sending.notSent) return "Email not sent";
        if (emailSending == sending.sending) return "Email sending";
        else return "Email sent";
    };

    if (!spotify) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}
            >
                <h2>Authentication</h2>
                <h3>1. Please authenticate with Spotify</h3>
                <SpotifyButton onClick={authenticate}>
                    Click here to authenticate spotify.
                </SpotifyButton>
            </div>
        );
    }

    if (!firebase) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}
            >
                <h2>Authentication</h2>
                <h3>2. Please sign in with Firebase</h3>
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
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
            }}
        >
            <h2>Authentication</h2>
            <h3>3. Please setup your profile</h3>
            <div style={{ marginTop: "1rem" }}>
                Name
                <input
                    value={name}
                    style={{
                        marginLeft: "1rem",
                    }}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={registerUser}>Submit</button>
            </div>
        </div>
    );
}
