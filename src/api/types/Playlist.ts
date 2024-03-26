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
  images: img[];
}

interface TrackItem {
  track: Track;
}

interface img {
  url: string;
  height: number;
  width: number;
}
