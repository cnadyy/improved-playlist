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

export class PerpetualTimer {
    private paused: boolean = true;
    private timeout?: NodeJS.Timeout;
    onResume: () => number | Promise<number>;

    /**
     * @param onResume is called when uppaused. Returned function is then recursively called
     */
    constructor(onResume: () => number | Promise<number>) {
        this.onResume = onResume;
    }

    setPaused(state?: boolean) {
        this.paused = state ? state : !this.paused;
        if (this.timeout && this.paused) clearTimeout(this.timeout);
        else if (this.onResume && !this.paused)
            this._startTimer(this.onResume, 0);
    }

    /**
     * @param callback should return the number of ms until it is called again
     * @param ms passed on to the timer given that this.paused is false
     */
    _startTimer(callback: () => number | Promise<number>, ms: number) {
        if (!this.paused)
            this.timeout = setTimeout(async () => {
                const ms = await callback();
                this._startTimer(callback, ms);
            }, ms);
    }
}
