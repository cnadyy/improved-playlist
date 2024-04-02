import fetch, { useWebAPI } from "@api/spotify/fetch";
import uriToId from "../idFromUri";
import { UseQueryResult } from "@tanstack/react-query";

export default function getPlaylist(id: SpotifyURI): Promise<Playlist> {
    return fetch("playlists/" + uriToId(id));
}

export function usePlaylist(id: SpotifyURI): UseQueryResult<Playlist> {
    return useWebAPI("playlists/" + uriToId(id));
}
