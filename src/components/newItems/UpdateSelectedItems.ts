type Action =
    | { type: "SET_FOLDER"; id: FolderId }
    | { type: "SET_PLAYLIST"; id: PlaylistId };

export type SelectedItems = {
    folders: FolderId[];
    playlists: PlaylistId[];
};

type mutFn = ReturnsParameter<PlaylistId[] | FolderId[]>;

export default function UpdateSelectedItems(
    state: SelectedItems,
    action: Action,
): SelectedItems {
    const addItem: mutFn = (items) => items.concat([action.id]);
    const delItem: mutFn = (items) => items.filter((p) => p != action.id);
    const isSelected: (itmes: PlaylistId[] | FolderId[]) => boolean = (items) =>
        items.includes(action.id);

    switch (action.type) {
        case "SET_PLAYLIST":
            return {
                ...state,
                playlists: isSelected(state.playlists)
                    ? delItem(state.playlists)
                    : addItem(state.playlists),
            };
        case "SET_FOLDER":
            return {
                ...state,
                folders: isSelected(state.folders)
                    ? delItem(state.folders)
                    : addItem(state.folders),
            };
    }
}
