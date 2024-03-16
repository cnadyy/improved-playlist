interface Folder {
    // Playlists are only kept by id as data is likely to be regularly mutated by the user on Spotify
    playlists: SpotifyURI[];
    id: string;
    name: string;
    // covers will be a fixed colour for now
    color: string;
}
