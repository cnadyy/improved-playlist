interface Folder {
    items: Subitem[];
    id: string;
    name: string;
    color: string;
    isPinned: boolean;
    public: boolean;
    owner: string;
}

type Subitem =
    | { kind: SubitemKind.SpotifyURI; itemID: SpotifyURI }
    | { kind: SubitemKind.Folder; itemID: string };

enum SubitemKind {
    SpotifyURI = 1,
    Folder = 2,
}

export { SubitemKind };
export type { Folder as default, Subitem };
