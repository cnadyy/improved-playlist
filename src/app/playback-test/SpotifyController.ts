import { playerReady } from "@/api/hooks/spotify/usePlaybackSDK";
import webAPIFetchWithJSON, { webAPIFetch } from "@/api/spotify/fetch";
import uriToId from "@/api/spotify/idFromUri";

type context = {
    uri: playlistURI;
    lastPage: {
        tracks: TrackItem[];
    };
};

/**
 * @info note that the Queuer will cache a Context permantly and does not support changes while active.
 * Spotify provides no event for changes to a given resource and I refuse to add timers
 */
export class SpotifyController {
    private onNaturalFinish: () => void;
    private onForcedStop: () => void;
    private active: boolean = true;
    private playerContext?: context;

    constructor(
        uri: SpotifyURI,
        onNaturalFinish: () => void,
        onForcedStop: () => void,
    ) {
        this.onNaturalFinish = onNaturalFinish;
        this.onForcedStop = onForcedStop;

        // trigger queue checks on state change
        // this fires only when playing audio through the tab
        playerReady.then(async (player) => {
            await this.play(uri);
            player.addListener("player_state_changed", this._setPlaybackState);
        });
    }

    async play(uri: SpotifyURI) {
        await this._setActiveContext(uri);
        await webAPIFetch("me/player/play", {
            method: "PUT",
            body: JSON.stringify({
                context_uri: uri,
            }),
        });
    }

    async _setActiveContext(uri: playlistURI): Promise<context> {
        let playlistPage: Playlist = await webAPIFetchWithJSON(
            "playlists/" + uriToId(uri),
        );

        // get last possible page
        if (playlistPage.tracks.total > playlistPage.tracks.limit) {
            playlistPage = await webAPIFetchWithJSON(
                "playlists/" +
                    uriToId(uri) +
                    "?offset=" +
                    (playlistPage.tracks.total - playlistPage.tracks.limit),
            );
        }

        this.playerContext = {
            uri: uri,
            lastPage: {
                tracks: playlistPage.tracks.items,
            },
        };

        return this.playerContext;
    }

    _userExit() {
        this.active = false;
        this.onForcedStop();
    }

    _setPlaybackState(s: Spotify.PlaybackState) {
        if (!this.active) return;

        // exit if user has played another individual song. stop auto control
        if (s.context.uri == null) {
            this._userExit();
            return;
        }

        // exit if the user plays something else manually and context is ready to be referenced
        if (s.context.uri != this.playerContext!.uri) {
            this._userExit();
            return;
        }

        // determine if the context has finished playback
        if (
            SpotifyController._shouldNext(
                s,
                this.playerContext!.lastPage.tracks,
            )
        )
            this.onNaturalFinish();
    }

    unmount() {
        playerReady.then((player) => {
            player.removeListener(
                "player_state_changed",
                this._setPlaybackState,
            );
        });
    }

    /**
     * a new context is played if all the following are met:
     * - previous two songs match the last two
     * this leaves peculiar setups like two songs played over and over in a playlist as broken
     * but mostly there is no concern. More conditions could be added.
     *
     * @param c array of the last tracks in a context
     * @param s current state to evaluate
     */
    static _shouldNext(s: Spotify.PlaybackState, c: TrackItem[]): boolean {
        const trackURI = (t: Spotify.Track | TrackItem) => t.uri;

        return (
            JSON.stringify(c.slice(-2).map(trackURI)) ==
            JSON.stringify(s.track_window.previous_tracks.map(trackURI))
        );
    }
}
