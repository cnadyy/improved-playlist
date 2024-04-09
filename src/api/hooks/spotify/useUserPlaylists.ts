import UserPlaylistExplorer, {
    UserPlaylistPages,
} from "@/api/spotify/get/UserPlaylistExplorer";
import { useEffect, useReducer, useState } from "react";

type Action =
    | { type: "SET_CONTROLLER"; controller: UserPlaylistPages }
    | { type: "SET_NEXT"; next: boolean }
    | { type: "SET_LOADING"; loading?: boolean };

type controllerState = {
    controller: UserPlaylistPages;
    next: boolean;
    isLoading: boolean;
};

function UpdateController(
    state: controllerState,
    action: Action,
): controllerState {
    switch (action.type) {
        case "SET_CONTROLLER":
            return {
                ...state,
                controller: action.controller,
            };
        case "SET_NEXT":
            return {
                ...state,
                isLoading: false,
                next: action.next,
            };
        case "SET_LOADING":
            return {
                ...state,
                next:
                    typeof action.loading == "undefined"
                        ? true
                        : action.loading,
            };
    }
}

/**
 * @info manages list with a proxy UserPlaylistExplorer object
 * @returns userPlaylists, uPlaylists reducer
 */
export default function useUserPlaylists(): [
    Playlist[],
    typeof playlistController,
] {
    const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
    const [userPlaylistCtl, dispatchCtl] = useReducer(UpdateController, {
        controller: UserPlaylistExplorer(),
        next: false,
        isLoading: false,
    });

    useEffect(() => {
        updatePlaylists();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatchCtl({ type: "SET_LOADING" });
        userPlaylistCtl.controller
            .hasNextPage()
            .then((hasPage) =>
                dispatchCtl({ type: "SET_NEXT", next: hasPage }),
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPlaylists]);

    const updatePlaylists = () =>
        userPlaylistCtl.controller.getItems().then(setUserPlaylists);

    const loadNextPage = () => {
        dispatchCtl({ type: "SET_LOADING" });
        userPlaylistCtl.controller.nextPage().then(updatePlaylists);
    };

    const playlistController = { ...userPlaylistCtl, loadNext: loadNextPage };

    return [userPlaylists, playlistController];
}
