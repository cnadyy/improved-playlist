import {Dispatch, SetStateAction, useEffect, useState} from "react";
import getCurrentUserPlaylist from "@api/getCurrentUserPlaylist";

function UserPlaylists({ onAdd }: { onAdd: (playlist: Playlist) => void }) {

    function fetchPlaylists(setPlaylists: Dispatch<SetStateAction<Playlist[]>>) {
        getCurrentUserPlaylist().then(response => {
            console.log(response)
            setPlaylists(response.items)
        })
    }

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    useEffect(() => {
        fetchPlaylists(setPlaylists)
    }, []);

    return <ul>
        {
            playlists.map((playlist) => {
                return <li key={playlist.id}><button onClick={() => onAdd(playlist)}>+</button> {playlist.name}</li>
            })
        }
    </ul>
}

export default UserPlaylists