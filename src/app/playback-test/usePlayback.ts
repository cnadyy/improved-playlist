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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

/**
 * @info ensures the folder is accessible before rebuilding the PlayEvent promise
 */
export function useFolderLoader(
    playbackEvent: PlayEvent,
    openFolder: () => void,
): void {
    useEffect(() => {
        playbackEvent.then(() => openFolder());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playbackEvent]);
}
