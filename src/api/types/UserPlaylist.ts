interface UserPlaylist {
  next: string | null;
  previous: string | null;
  total: number;
  items: Playlist[];
}
