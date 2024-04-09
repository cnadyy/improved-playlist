import { PerpetualTimer } from "@/api/util";
import { useEffect, useState } from "react";

/**
 * @info use start and stop to control the player
 * @info  use .setDisabled() to control disabled items
 * // TODO: Refactor to have private methods when the build target is change
 */
class Player extends PerpetualTimer {
    onFinish?: () => void;
    private id: FolderId;
    private songs: { uri: ItemId; parent: ItemId }[] = [];
    private disabledItems?: { playlists: PlaylistId[]; folders: FolderId[] };

    constructor(id: FolderId, onFinish?: () => void) {
        // set dummy and replace
        super(() => -1);
        this.onResume = this._wrappedOnStart;
        this.id = id;
        this._resolveURIs();
        this.onFinish = onFinish;
    }

    // Catches the errors that would otherwise be swallowed in setTimeout
    _wrappedOnStart(): Promise<number> {
        return new Promise<number>((resolve) => {
            this._onStart()
                .then((res) => resolve(res))
                .catch((err) => {
                    this.setPaused(false);
                    console.log(err);
                });
        });
    }

    /**
     * @info resolves next id for queue
     * FIXME: Write resolution and PerpetualTimer capabilities
     */
    _next() {
        this.songs.push();
    }

    /**
     * @info resolves a buffer of up to 20 songs
     */
    async _resolveURIs() {}

    /**
     * @info calls out to spotify to queue the URIs in the queue
     * // FIMXE: Skips disabledItems here
     */
    async _queueURIs() {
        console.log(this.songs.shift());
        console.log(this.songs.shift());
        console.log(this.songs.shift());
    }

    /**
     * @returns number of ms until next call required
     */
    async _onStart(): Promise<number> {
        await this._resolveURIs();
        // check time until next queue needed
        const ms = 0;
        await this._queueURIs();
        return ms;
    }

    /**
     * @param index index of top level item to start the playback at
     */
    // FIXME: allow playback of any point in tree
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    start(index: number) {
        this.setPaused(false);
    }

    stop() {
        this.setPaused(true);
    }

    setDisabledItems() {}
}
// resolve in firebase
// check every x seconds for queue status
// queue songs given conditions
// queue once, throw out, resolve next to queue

/**
 * @info initates Player object
 * @returns uncontroled Player object with side effect utility methods
 */
export default function useUserFolders(id: FolderId): undefined | Player {
    const [player, setPlayer] = useState<undefined | Player>();

    useEffect(() => {
        setPlayer(new Player(id));
    }, [id]);

    return player;
}
