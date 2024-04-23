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
 * @info the expected lifetime for the controller is the playback of a single context
 */
export class SpotifyController {
    private onNaturalFinish: () => void;
    private onForcedStop: () => void;
    private deviceID: string;
    private playerContext?: context;
    // used for contexts where no tracks play after the last trcak
    private isLastSong?: SpotifyURI;
    // debouncer
    private unmounted?: boolean;

    constructor(
        uri: SpotifyURI,
        deviceID: string,
        onNaturalFinish: () => void,
        onForcedStop: () => void,
    ) {
        this.onNaturalFinish = onNaturalFinish;
        this.onForcedStop = onForcedStop;
        this.deviceID = deviceID;

        // trigger queue checks on state change
        // this fires only when playing audio through the tab
        playerReady.then(async (player) => {
            await this.play(uri);
            player.addListener(
                "player_state_changed",
                this._setPlaybackState.bind(this),
            );
        });
    }

    async play(uri: SpotifyURI) {
        await this._setActiveContext(uri);
        await webAPIFetch(`me/player/play?device_id=${this.deviceID}`, {
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
            const tracksPage = await webAPIFetchWithJSON(
                "playlists/" +
                    uriToId(uri) +
                    "/tracks" +
                    "?offset=" +
                    (playlistPage.tracks.total - playlistPage.tracks.limit) +
                    "&limit=" +
                    playlistPage.tracks.limit,
            );
            this.playerContext = {
                uri: uri,
                lastPage: {
                    tracks: tracksPage.items,
                },
            };
        } else
            this.playerContext = {
                uri: uri,
                lastPage: {
                    tracks: playlistPage.tracks.items,
                },
            };

        return this.playerContext;
    }

    _setPlaybackState(s: Spotify.PlaybackState) {
        // debounce late calls due to unsynchronous behaviour
        if (this.unmounted) return;

        // exit if user has played another individual song. stop auto control
        if (s.context.uri == null) {
            this.unmount(this.onForcedStop);
            return;
        }

        // exit if the user plays something else manually
        if (s.context.uri != this.playerContext!.uri) {
            this.unmount(this.onForcedStop);
            return;
        }

        // determine if the context has finished playback
        if (
            // check if context with no further auto play has finished
            (typeof this.isLastSong != "undefined" &&
                this.isLastSong != s.track_window.current_track.uri) ||
            // check if a context with autoplay has finished
            this._shouldNext(s, this.playerContext!.lastPage.tracks)
        )
            this.unmount(this.onNaturalFinish);
    }

    unmount(after?: () => void) {
        this.unmounted = true;
        playerReady.then((player) => {
            player.removeListener(
                "player_state_changed",
                this._setPlaybackState,
            );
            // a hack but it seems to behave better if given an event loop of delay
            if (after) setTimeout(after, 0);
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
    _shouldNext(s: Spotify.PlaybackState, c: TrackItem[]): boolean {
        console.log(
            JSON.stringify(c.slice(-2).map((track) => track.track.uri)) +
                ":" +
                JSON.stringify(
                    s.track_window.previous_tracks.map((track) => track.uri),
                ),
        );
        if (s.track_window.next_tracks.length == 0)
            this.isLastSong = s.track_window.current_track.uri;

        return (
            JSON.stringify(c.slice(-2).map((track) => track.track.uri)) ==
            JSON.stringify(
                s.track_window.previous_tracks.map((track) => track.uri),
            )
        );
    }
}
