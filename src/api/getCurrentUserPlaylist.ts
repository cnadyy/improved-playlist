import fetch from '@api/fetch';
class PlaylistExplorer {
    constructor() {
        this.request = getCurrentUserPlaylist();
        this.playlists = this.#addPlaylists(request);
    }
    getNextPlaylist() {
        return this.player;
    }
    #addPlaylists() {
        // add playlists from active request
    }
}
async function getCurrentUserPlaylist(): Promise<CurrentUserPlaylistResponse> {
    const response = await fetch('me/playlists', {method: 'GET'});
    if (response.status != 200) {
        return Promise.reject("Invalid status code")
    }
    return await response.json();
}

export default getCurrentUserPlaylist;
