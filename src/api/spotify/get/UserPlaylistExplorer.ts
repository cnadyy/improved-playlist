import { PageExplorer } from "@/api/spotify/PageExplorer";
import fetch from "@api/spotify/fetch";

export type UserPlaylistPages = PageExplorer<UserPlaylist, Playlist>;

function UserPlaylistExplorer(): UserPlaylistPages {
    return new PageExplorer<UserPlaylist, Playlist>(
        fetch("me/playlists"),
        (p) => p,
    );
}

export default UserPlaylistExplorer;
