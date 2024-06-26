/* eslint @typescript-eslint/no-unused-vars: 0 */
interface Playlist {
    description: string | undefined;
    href: string;
    id: PlaylistId;
    name: string;
    public: boolean;
    tracks: {
        href: string;
        total: number;
        items: TrackItem[];
        limit: number;
    };
    uri: string;
    images: img[];
}

type TrackItem = Track;

interface img {
    url: string;
    height: number;
    width: number;
}
