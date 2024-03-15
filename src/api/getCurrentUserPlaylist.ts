/*
Exports the UserPlaylistExplorer
 - use .getPlaylists to get a promise containing an array of Playlist
 - use nextPage and hasNextPage to expand the list
*/

import fetch from '@api/fetch';

class UserPlaylistExplorer {
    private pages: Promise<UserPlaylist>[];

    constructor() {
        this.pages = [getCurrentUserPlaylist()];
    }

    getPlaylists(): Promise<Playlist[]> {
        return Promise
            .all(this.pages)
            .then(pages => pages.flatMap(
                page => page.items
            ));
    }

    nextPage
}
async function getCurrentUserPlaylist(): Promise<UserPlaylist> {
    return await fetch('me/playlists', {method: 'GET'});
}

export default getCurrentUserPlaylist;
