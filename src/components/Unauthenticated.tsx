import authenticate from "@/api/spotify/authenticate";
import { isFirebaseAuthenticated, isSpotifyAuthenticated } from "@/api/util";
import { Auth } from "@/api/firebase/createApp";
import { sendSignInLinkToEmail } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import styled from "@emotion/styled";
import setUser from "@/api/firebase/set/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

enum sending {
    notSent,
    sending,
    sent,
}

const SpotifyButton = styled.div`
    background-color: limegreen;
    padding: 1rem;
    width: 30%;
    border-radius: 100px;
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    &:hover {
        background-color: green;
    }
`;

const Progress = styled.div<{ isCompleted: boolean }>`
    height: 10px;
    width: 25%;
    background-color: var(--secondary);
    opacity: ${(props) => (props.isCompleted ? 1 : 0.333)};
    border-radius: 5px;
`;

const ProgressContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: space-around;
`;

const Title = styled.h1`
    margin: 0px;
    font-size: 2rem;
    font-weight: 500;
`;

const TitleContainer = styled.h1`
    display: flex;
    align-items: center;
    margin: 0px;
`;

const Icon = styled.div`
    width: 2rem;
    height: 2rem;
    background-color: var(--primary);
    border-radius: 4px;
    margin-left: 1rem;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const InputBox = styled.input`
    border: none;
    border-bottom: 1px solid #a6a6a6;
    padding: 0.5rem;
    flex-grow: 1;
`;

const InputBoxContainer = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-content: center;
`;

function Dialog({
    children,
    progress,
}: {
    children: ReactNode;
    progress: number;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                justifyContent: "space-around",
                backgroundColor: "var(--secondary)",
            }}
        >
            <div
                style={{
                    backgroundColor: "#F0EFF4",
                    padding: "1.5rem",
                    width: "30rem",
                    height: "20rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 6,
                }}
            >
                {children}
                <ProgressContainer>
                    {[...Array(3).keys()].map((i) => (
                        <Progress key={i} isCompleted={i + 1 <= progress} />
                    ))}
                </ProgressContainer>
            </div>
        </div>
    );
}

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
        Auth.onAuthStateChanged(() => {
            isFirebaseAuthenticated().then(setFirebase);
        });
    }, []);

    const emailState: () => string = () => {
        if (emailSending == sending.notSent) return "";
        if (emailSending == sending.sending) return "Email sending";
        else return "Email sent";
    };

    if (!spotify) {
        return (
            <Dialog progress={1}>
                <TitleContainer>
                    <Title>Link with</Title>
                    <img
                        src="./Spotify_Logo_RGB_Green2.png"
                        alt="Spotify"
                        style={{
                            marginLeft: "0.75rem",
                            height: "1.2em",
                            width: "auto",
                        }}
                    />
                </TitleContainer>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <SpotifyButton onClick={authenticate}>
                        Link here
                    </SpotifyButton>
                </div>
            </Dialog>
        );
    }

    if (!firebase) {
        return (
            <Dialog progress={2}>
                <TitleContainer>
                    <Title>Sign in or up</Title>
                </TitleContainer>
                <div style={{ marginTop: "1rem", flexGrow: 1 }}>
                    <div>email</div>
                    <InputBoxContainer>
                        <InputBox
                            value={userEmail}
                            placeholder="email@example.com"
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <Icon onClick={sendLink}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </Icon>
                    </InputBoxContainer>
                    <p>{emailState()}</p>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog progress={3}>
            <TitleContainer>
                <Title>Set a username</Title>
            </TitleContainer>
            <div style={{ marginTop: "1rem", flexGrow: 1 }}>
                <div>username</div>
                <InputBoxContainer>
                    <InputBox
                        value={name}
                        placeholder="username"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Icon onClick={registerUser}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Icon>
                </InputBoxContainer>
            </div>
        </Dialog>
    );
}
