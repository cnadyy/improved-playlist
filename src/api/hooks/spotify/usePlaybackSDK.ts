/**
 * Note that the player is automatically connected on the loading of the file
 * Explicit disconnects can be made with disconnectDevice
 * The hooks hook into the active player and can be used anywhere
 */
import { useEffect, useState } from "react";

// permits callback to be used in many contexts without recreating player
const onAuthenticated =
    typeof window != "undefined"
        ? new Promise<Spotify.Player>(
              (resolve) =>
                  (window.onSpotifyWebPlaybackSDKReady = () => {
                      const p = new Spotify.Player({
                          name: "Improved Spotify Playlists",
                          getOAuthToken: (cb) =>
                              cb(
                                  localStorage.getItem(
                                      "access_token",
                                  ) as string,
                              ),
                          volume: 0.7,
                      });
                      p.on("initialization_error", (m) => console.error(m));
                      p.on("account_error", (m) => console.error(m));
                      p.on("authentication_error", (m) => console.error(m));
                      p.connect();
                      resolve(p);
                  }),
          )
        : null;

export const playerReady = onAuthenticated!;

type deviceID = string;

/**
 * @info it is important to use player.activateElement(); on a click somewhere for browser compat
 */
export function useSpotifyDevice(): [Promise<Spotify.Player>, deviceID | undefined] {
    const [ready, setReady] = useState<deviceID | undefined>();

    useEffect(() => {
        const setReadyTrue = ({ device_id }) => setReady(device_id);
        const setReadyFalse = (/*deviceId*/) => setReady();
        const logAutoPlayFail = () =>
            console.error(
                "Autoplay failed to initate the song. Try player.activateElement()",
            );

        onAuthenticated!.then((player) => {
            player.addListener("ready", setReadyTrue);
            player.addListener("not_ready", setReadyFalse);
            player.addListener("autoplay_failed", logAutoPlayFail);
        });
        return () => {
            onAuthenticated!.then((player) => {
                player.removeListener("ready", setReadyTrue);
                player.removeListener("not_ready", setReadyFalse);
                player.disconnect();
            });
        };
    }, []);

    return [onAuthenticated!, ready];
}

export function usePlaybackState(): Spotify.PlaybackState | undefined {
    const [playback, setPlayback] = useState<
        Spotify.PlaybackState | undefined
    >();

    useEffect(() => {
        onAuthenticated!.then((player) =>
            player.addListener("player_state_changed", setPlayback),
        );
        return () => {
            onAuthenticated!.then((player) =>
                player.removeListener("player_state_changed", setPlayback),
            );
        };
    }, []);

    return playback;
}
