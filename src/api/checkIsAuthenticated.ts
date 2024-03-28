import { Auth } from "@api/firebase/createApp";

const isFirebaseAuthenticated = () => Auth.authStateReady().then(() => Auth.currentUser != null);
const isSpotifyAuthenticated = () => localStorage.getItem("token") != "";

async function IsAuthenticated(): Promise<boolean> {
    return (await isFirebaseAuthenticated() && isSpotifyAuthenticated());
}

export { IsAuthenticated as default, isFirebaseAuthenticated, isSpotifyAuthenticated };
