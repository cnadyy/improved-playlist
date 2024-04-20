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

const Title = styled.a`
    margin: 0px;
    font-weight: 500;
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    font-size: 2rem;
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
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.7,
                    zIndex: 0,
                    userSelect: "none",
                }}
            >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path id="wavepath1" d="M80,-10 L110,20"></path>
                    <path id="wavepath2" d="M70,-10 L110,30"></path>
                    <path id="wavepath3" d="M60,-10 L110,40"></path>
                    <path id="wavepath4" d="M50,-10 L110,50"></path>
                    <text
                        textAnchor="start"
                        alignmentBaseline="middle"
                        fill="white"
                        fontSize={5}
                    >
                        <textPath href="#wavepath1" startOffset="-100%">
                            <animate
                                attributeName="startOffset"
                                from="-100%"
                                to="80%"
                                begin="0s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            <animate
                                attributeName="opacity"
                                from={0}
                                to={1}
                                begin={"0s"}
                                dur={"0.1s"}
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath1" startOffset="-100%">
                            <animate
                                attributeName="startOffset"
                                from="-100%"
                                to="80%"
                                begin="6s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            <animate
                                attributeName="opacity"
                                from={0}
                                to={1}
                                begin={"0s"}
                                dur={"0.1s"}
                            ></animate>
                            improved spotify
                        </textPath>
                    </text>
                    <text
                        textAnchor="start"
                        alignmentBaseline="middle"
                        r="5"
                        fill="white"
                        fontSize={5}
                    >
                        <textPath href="#wavepath2" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-120%"
                                to="80%"
                                begin="0s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath2" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-120%"
                                to="80%"
                                begin="8s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath2" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-120%"
                                to="80%"
                                begin="4s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                    </text>
                    <text
                        textAnchor="start"
                        alignmentBaseline="middle"
                        r="5"
                        fill="white"
                        fontSize={5}
                    >
                        <textPath href="#wavepath3" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="0s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath3" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="8s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath3" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="4s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                    </text>
                    <text
                        textAnchor="start"
                        alignmentBaseline="middle"
                        r="5"
                        fill="white"
                        fontSize={5}
                    >
                        <textPath href="#wavepath4" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="0s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath4" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="4s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                        <textPath href="#wavepath4" startOffset="-120%">
                            <animate
                                attributeName="startOffset"
                                from="-90%"
                                to="80%"
                                begin="8s"
                                dur="12s"
                                repeatCount="indefinite"
                            ></animate>
                            improved spotify
                        </textPath>
                    </text>
                </svg>
            </div>
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
                    zIndex: 10,
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
