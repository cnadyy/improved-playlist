/* eslint @typescript-eslint/no-unused-vars: 0 */
interface UserPlaylist extends Pages {
    next: string | null;
    previous: string | null;
    total: number;
    items: Playlist[];
}
