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

const device = new Promise<{ player: Spotify.Player; id: deviceID }>(
    (resolve, reject) => {
        onAuthenticated!.then((player) => {
            player.addListener("ready", ({ device_id }) => {
                resolve({ player, id: device_id });
            });
            player.addListener("autoplay_failed", () =>
                reject(
                    "Autoplay of player failed. Try player.activateElement()",
                ),
            );
        });
    },
);

/**
 * @info it is important to use player.activateElement(); on a click somewhere for browser compat
 */
export function useSpotifyDevice(): Promise<{
    player: Spotify.Player;
    id: deviceID;
}> {
    return device;
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
