const nameMatch = (playlist: Playlist, query: string) =>
    playlist.name.toLowerCase().includes(query.toLowerCase());

/**
 * @returns boolean to be used in .filter
 */
export default function filterPlaylist(
    playlist: Playlist,
    searchEntry: string,
): boolean {
    return searchEntry ? nameMatch(playlist, searchEntry) : true;
}
