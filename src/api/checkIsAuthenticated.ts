import { Auth } from "@api/firebase/createApp";

const isFirebaseAuthenticated = () =>
    Auth.authStateReady().then(() => Auth.currentUser != null);
const isSpotifyAuthenticated = () =>
    localStorage.getItem("access_token") != "" &&
    localStorage.getItem("access_token") != null;

async function IsAuthenticated(): Promise<boolean> {
    return (await isFirebaseAuthenticated()) && isSpotifyAuthenticated();
}

export {
    IsAuthenticated as default,
    isFirebaseAuthenticated,
    isSpotifyAuthenticated,
};
