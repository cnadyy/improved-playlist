interface UserPlaylist {
    next: string | null;
    previous: string | null;
    total: int;
    items: Playlist[];
}
