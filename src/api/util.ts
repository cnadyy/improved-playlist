import { Auth } from "@api/firebase/createApp";

export const isFirebaseAuthenticated = () =>
    Auth.authStateReady().then(() => Auth.currentUser != null);

export const isSpotifyAuthenticated = () =>
    localStorage.getItem("access_token") != "" &&
    localStorage.getItem("access_token") != null;

export async function isAuthenticated(): Promise<boolean> {
    return (await isFirebaseAuthenticated()) && isSpotifyAuthenticated();
}

/**
 * @author atmin (stackoverflow)
 * @param x object x
 * @param y object y
 * @returns if they have the same content
 */
export function deepEqual(x: object, y: object): boolean {
    return x && y && typeof x === "object" && typeof y === "object"
        ? Object.keys(x).length === Object.keys(y).length &&
              Object.keys(x).reduce(function (isEqual, key) {
                  //@ts-expect-error nothing can know the types here
                  return isEqual && deepEqual(x[key], y[key]);
              }, true)
        : x === y;
}
