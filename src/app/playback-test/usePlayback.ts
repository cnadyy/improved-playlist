import { useSpotifyDevice } from "@/api/hooks/spotify/usePlaybackSDK";
import { SpotifyController } from "@/app/playback-test/SpotifyController";
import { useEffect, useRef } from "react";

export function usePlayback(
    uri: SpotifyURI,
    playbackEvent: PlayEvent,
    disabled: boolean,
) {
    const device = useSpotifyDevice();
    const playEventAttached = useRef(false);
    useEffect(() => {
        if (!playEventAttached.current) {
            playbackEvent.then((resolvePlayback) => {
                console.log("PLAYLIST STARTED: " + uri + " (" + disabled + ")");
                if (disabled) {
                    console.log("TRACK WAS DISABLED NOW RESOLVING " + uri);
                    resolvePlayback();
                } else {
                    console.log("PLAYING PLAYLIST URI " + uri);
                    device.then(({ id }) => {
                        new SpotifyController(uri, id, resolvePlayback, () =>
                            console.log("abandoned playback"),
                        );
                    });
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
