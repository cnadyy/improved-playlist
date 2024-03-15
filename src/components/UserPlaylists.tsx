// TODO: Rewrite using reducer

import {useEffect, useState} from "react";
import PlaylistExplorer from "@api/UserPlaylistExplorer";

function AuthUserPlaylists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [controller, setController] = useState<PlaylistExplorer | null>(null);
    const [hasNextPage, setNextPage] = useState<boolean>(false);

    useEffect(() => {
        setController(new PlaylistExplorer());
    }, []);

    useEffect(() => {
        if (controller) {
            controller.getPlaylists()
                .then(setPlaylists);
            controller.hasNextPage()
                .then(setNextPage);
        }
    }, [controller]);

    // this is what happens if you try and manage state yourself....
    // controller will exist as hasNextPage can only be true if the controller is set
    // and must manually invoke an update of the playlist content 
    const nextPage = () => controller!.nextPage()
        .then(() => controller!.getPlaylists().then(setPlaylists));

    return <ul>
        {playlists.map((playlist) => <li key={playlist.id}>{playlist.name}</li>)}
        {hasNextPage ? (
            // TODO: extract component to have a loading state depedant on nextPage promise
            <button onClick={nextPage}>load more</button>
        ) : null}
    </ul>
}

export default AuthUserPlaylists
