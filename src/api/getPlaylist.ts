import fetch from "@api/fetch";
import uriToId from "./idFromUri";

export default function getPlaylist(id: SpotifyURI): Promise<Playlist> {
  return fetch("playlists/" + uriToId(id));
}
