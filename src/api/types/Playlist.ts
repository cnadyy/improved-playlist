interface Playlist {
  description: string | undefined;
  href: string;
  id: string;
  name: string;
  public: boolean;
  tracks: {
    href: string;
    total: number;
    items: TrackItem[];
  };
  uri: string;
}

interface TrackItem {
  track: Track;
}
