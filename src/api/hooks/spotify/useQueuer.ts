import Queuer from "@/api/spotify/Queuer";

class GraphDiscoverer extends Queuer {
    cursor: TrailId;

    constructor(id: FolderId) {
        super(id);
        this.cursor = [];
    }

    setCursor(cursor: TrailId) {
        this.cursor = cursor;
    }
}

class PlayerControls extends GraphDiscoverer {
    constructor(id: FolderId) {
        super(id);
    }

    start(cursor?: TrailId) {
        if (cursor) this.setCursor(cursor);
        super.setPaused(false);
    }

    stop() {
        super.setPaused(true);
    }
}

/**
 * @info initates Player object
 * @returns uncontroled Player object with side effect utility methods
 */
export default function useUserFolders(id: FolderId): PlayerControls {
    const player = new PlayerControls(id);

    return player;
}
