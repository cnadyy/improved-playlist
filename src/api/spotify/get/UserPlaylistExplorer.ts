import { PageExplorer } from "@/api/spotify/PageExplorer";
import fetch from "@api/spotify/fetch";

function UserPlaylistExplorer() {
    return new PageExplorer<UserPlaylist, Playlist>(
        fetch("me/playlists?limit=1"),
        (p) => p,
    );
}

export default UserPlaylistExplorer;
