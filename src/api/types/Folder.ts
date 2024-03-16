interface Folder {
  // Playlists are only kept by id as data is likely to be regularly mutated by the user on Spotify
  items: Subitem[];
  id: string;
  name: string;
  // covers will be a fixed colour for now
  color: string;
  open: boolean;
}

interface Subitem {
  kind: SubitemKind;
  itemID: number | SpotifyURI;
}

enum SubitemKind {
  SpotifyURI = 1,
  Folder = 2,
}

export { SubitemKind };
export type { Folder as default, Subitem };
