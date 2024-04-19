import { useEffect, useRef } from "react";

export function usePlayback(
    uri: SpotifyURI,
    playbackEvent: PlayEvent,
    disabled: boolean,
) {
    useEffect(() => {
        playbackEvent.then((resolvePlayback) => {
            console.log("track attempted: " + uri + " " + disabled + "and this means" + Boolean(disabled));
            // if (disabled) resolvePlayback();
            // // TODO: play the playlist on spotify and detect when complete
            // else {
            //     console.log("startd timeout")
            //     setTimeout(() => {console.log("done"); resolvePlayback()}, 5000);
            // }
        });
    }, []);
}

/**
 * @info ensures the folder is accessible before rebuilding the PlayEvent promise
 */
export function useNestedPlayback(
    playbackEvent: PlayEvent,
    openFolder: () => void,
): PlayEvent {
    return useRef(
        new Promise<resolvePlayback>((resolve) => {
            playbackEvent.then((resolvePlayback) => {
                openFolder();
                resolve(resolvePlayback);
            });
        }),
    ).current;
}
