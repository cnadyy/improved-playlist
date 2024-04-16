import { playerReady } from "@/api/hooks/spotify/usePlaybackSDK";
import webAPIFetchWithJSON, { webAPIFetch } from "@/api/spotify/fetch";
import uriToId from "@/api/spotify/idFromUri";
import { useEffect, useState } from "react";

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
export class Queuer {
    nextPlaylist: () => Promise<playlistURI>;
    active: boolean = false;
    onForcedStop: () => void;
    playerContext?: context;
    // debouncing variables
    settingContext?: Promise<context>;
    settingSpotify: boolean = false;

    constructor(
        nextPlaylist: () => Promise<playlistURI>,
        onForcedStop?: () => void,
    ) {
        this.nextPlaylist = nextPlaylist;
        this.onForcedStop = onForcedStop ? onForcedStop : () => {};

        // trigger queue checks on state change
        // this fires only when playing audio through the tab
        playerReady.then((player) => {
            player.addListener("player_state_changed", this.setPlaybackState);
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

    // debounced activeContext controller
    _getActiveContext(uri: playlistURI): Promise<context> {
        if (typeof this.playerContext != "undefined")
            return new Promise((r) => r(this.playerContext!));
        if (typeof this.settingContext == "undefined")
            this.settingContext = new Promise((resolve) =>
                this._setActiveContext(uri).then(resolve),
            );

        return this.settingContext!;
    }

    _userExit() {
        this.active = false;
        this.onForcedStop();
    }

    setPlaybackState(s: Spotify.PlaybackState) {
        if (!this.active) return;
        // exit if user has played another individual song. stop auto control
        if (s.context.uri == null) {
            this._userExit();
            return;
        }
        // automatically resolves the initial context if none is set
        this._getActiveContext(s.context.uri).then(async (context) => {
            // exit if the user plays something else manually and context is ready to be referenced
            if (s.context.uri != context.uri) {
                this._userExit();
                return;
            }

            // with debouncing determine if the next context is ready to be set
            if (
                !this.settingSpotify &&
                Queuer._shouldNext(s, context.lastPage.tracks)
            ) {
                try {
                    this.settingSpotify = true;
                    const id = await this.nextPlaylist();
                    await webAPIFetch("me/player/play", {
                        method: "PUT",
                        body: JSON.stringify({
                            context_uri: id,
                        }),
                    });
                    await this._setActiveContext(id);
                } catch {
                    // if there are no songs left to play, forceStop
                    this.active = false;
                    this.onForcedStop();
                } finally {
                    this.settingSpotify = false;
                }
            }
        });
    }

    unmount() {
        playerReady.then((player) => {
            player.removeListener(
                "player_state_changed",
                this.setPlaybackState,
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

// responsible for unpacking a folder into its individual playlist uris
export class FolderUnpacker {
    cursor: TrailId;
    root: FolderId;

    constructor(id: FolderId) {
        this.cursor = [];
        this.root = id;
    }

    setCursor(cursor: TrailId) {
        this.cursor = cursor;
    }

    async next(): Promise<playlistURI> {
        return "";
    }
}

export class PlayerControls {
    private unpacker: FolderUnpacker;
    private queuer: Queuer;

    constructor(id: FolderId) {
        this.unpacker = new FolderUnpacker(id);
        this.queuer = new Queuer(this.unpacker.next);
    }

    start(cursor?: TrailId) {
        if (cursor) this.unpacker.setCursor(cursor);
        this.queuer.active = true;
        playerReady.then((p) => p.resume());
    }

    stop() {
        playerReady.then((p) => p.pause());
        this.queuer.active = false;
    }

    unmount() {
        this.queuer.unmount();
    }
}

/**
 * @info initates Player object
 * @returns uncontroled Player object with side effect utility methods
 */
export default function useUserFolders(
    id: FolderId,
): PlayerControls | undefined {
    const [player, setPlayer] = useState<PlayerControls>();

    useEffect(() => {
        const p = new PlayerControls(id);
        setPlayer(p);
        return p.unmount;
    }, [id]);

    return player;
}
