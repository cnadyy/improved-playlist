import Queuer from "@/api/spotify/Queuer";
import { Graph } from "@dagrejs/graphlib";

class GraphDiscoverer extends Queuer {
    session: Graph;
    cursor: TrailId;

    constructor(id: FolderId) {
        super(id);
        this.session = new Graph();
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
