import { useEffect, useRef } from "react";

export function usePlayback(
    uri: SpotifyURI,
    playbackEvent: PlayEvent,
    disabled: boolean,
) {
    const playEventAttached = useRef(false);
    useEffect(() => {
        if (!playEventAttached.current) {
            playbackEvent.then((resolvePlayback) => {
                console.log("PLAYLIST STARTED: " + uri + " (" + disabled + ")");
                if (disabled) {
                    console.log("TRACK WAS DISABLED NOW RESOLVING " + uri);
                    resolvePlayback();
                }
                // // TODO: play the playlist on spotify and detect when complete
                else {
                    setTimeout(() => {
                        console.log("RESOLVED TIMER 1500 for " + uri);
                        resolvePlayback();
                    }, 1500);
                }
            });
            playEventAttached.current = true;
        }
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
