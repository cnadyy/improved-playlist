/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, {
    CSSProperties,
    useEffect,
    useReducer,
    useRef,
    useState,
} from "react";
import SearchBar from "../SearchBar";
import SearchItemList from "./SearchItemList";
import Folder from "@/api/types/Folder";
import getFolderList from "@fb/get/userFolders";
import HideScrollBar from "@/css/HideScrollBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faFilter,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import FilterDialog from "./FilterDialog";
import filterOptions from "@/api/types/FilterOptions";
import filterPlaylist from "@/api/search-functions/filterPlaylists";
import filterFolder from "@/api/search-functions/filterFolders";
import UpdateSelectedItems from "./UpdateSelectedItems";
import addItems from "@/api/side-effects/addItems";
import { FolderBlock } from "./itemBlocks";
import { PlaylistBlock } from "./itemBlocks";
import useUserPlaylists from "@/api/hooks/spotify/useUserPlaylists";
import useUser from "@/api/firebase/get/user";
import { Auth } from "@/api/firebase/createApp";
import Loading from "@/components/Loading";

const AddItemStyles: CSSProperties = {
    maxWidth: "750px",
    width: "750px",
    padding: "0",
    height: "75vh",
    overflow: "hidden",
};

export const Selected: () => React.ReactNode = () => (
    <div
        style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "8rem",
            backgroundColor: "#00000066",
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
        }}
    >
        <p style={{ color: "white" }}>selected</p>
    </div>
);

/**
 *
 * @param showModal used to indicate if the modal should be open
 * @param closeModal called when the close button is pressed in the modal
 * @note the state of the modal should be externally controlled, with closeModal used to set it to false
 * @returns dialog component that is hidden by default
 */
export default function AddItem({
    showModal,
    closeModal,
    folderID,
}: {
    showModal: boolean;
    closeModal: () => void;
    folderID: FolderId;
}): React.ReactNode {
    // FIXME: too many useStates
    const ref = useRef<HTMLDialogElement>(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<filterOptions>(filterOptions.NONE);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [folderList, setFolderList] = useState<Folder[]>([]);
    const [submit, setSubmit] = useState("add");

    const [selected, dispatchSelected] = useReducer(UpdateSelectedItems, {
        folders: [],
        playlists: [],
    });
    const [playlists, playlistsQuery] = useUserPlaylists();
    const user = useUser(Auth.currentUser!.uid);

    useEffect(() => {
        if (showModal) ref.current?.showModal();
        else ref.current?.close();
    }, [showModal]);

    // folder fetching
    useEffect(() => {
        getFolderList().then(setFolderList);
    }, []);

    if (!user) {
        return <Loading />;
    }

    return (
        <dialog ref={ref} onCancel={closeModal} style={AddItemStyles}>
            <div
                style={{
                    maxHeight: "75vh",
                    overflowY: "visible",
                    boxSizing: "border-box",
                    padding: "1.5rem 2rem 0.1rem",
                    display: "flex",
                    flexDirection: "column",
                    ...HideScrollBar,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        display: "grid",
                        placeItems: "center",
                        gridTemplateColumns:
                            "5% [centerStart] auto [centerEnd] 5%",
                        gridTemplateRows: "[start] auto [end]",
                    }}
                >
                    {filter != filterOptions.NONE ? (
                        <FontAwesomeIcon
                            icon={faChevronLeft}
                            style={{
                                height: "1.5rem",
                                width: "100%",
                                cursor: "pointer",
                            }}
                            onClick={() => setFilter(filterOptions.NONE)}
                        />
                    ) : null}
                    <SearchBar
                        entry={query}
                        setEntry={setQuery}
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            height: "2.5rem",
                            gridArea: "start / centerStart / end / centerEnd",
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faFilter}
                        style={{
                            height: "1.5rem",
                            cursor: "pointer",
                            gridArea: "start / centerStart / end / centerEnd",
                            justifySelf: "end",
                            marginRight: "3%",
                        }}
                        onClick={() => setFiltersOpen(!filtersOpen)}
                    />
                    <FilterDialog
                        showFilters={filtersOpen}
                        closeFilters={() => setFiltersOpen(false)}
                        filter={filter}
                        setFilter={(f) => setFilter(f)}
                    />
                </div>
                {filter == filterOptions.NONE ? (
                    <div style={{ overflowY: "scroll", ...HideScrollBar }}>
                        <SearchItemList
                            name="Folders"
                            expandList={() => setFilter(filterOptions.FOLDERS)}
                        >
                            {folderList.map((f) =>
                                FolderBlock(f, selected, (id) =>
                                    dispatchSelected({
                                        type: "SET_FOLDER",
                                        id: id,
                                    }),
                                ),
                            )}
                        </SearchItemList>
                        <SearchItemList
                            name="Playlists"
                            expandList={() =>
                                setFilter(filterOptions.PLAYLISTS)
                            }
                        >
                            {playlists.map((p) =>
                                PlaylistBlock(p, selected, (id) =>
                                    dispatchSelected({
                                        type: "SET_PLAYLIST",
                                        id: id,
                                    }),
                                ),
                            )}
                        </SearchItemList>
                    </div>
                ) : (
                    <div
                        style={{
                            overflowY: "scroll",
                            ...HideScrollBar,
                            margin: "2rem 0",
                        }}
                    >
                        <SearchItemList full>
                            {filter == filterOptions.FOLDERS ? (
                                folderList
                                    .filter((f) =>
                                        filterFolder(f, query, user.pinned),
                                    )
                                    .map((f) =>
                                        FolderBlock(f, selected, (id) =>
                                            dispatchSelected({
                                                type: "SET_FOLDER",
                                                id: id,
                                            }),
                                        ),
                                    )
                            ) : filter == filterOptions.PLAYLISTS ? (
                                playlists
                                    .filter((p) => filterPlaylist(p, query))
                                    .map((p) =>
                                        PlaylistBlock(p, selected, (id) =>
                                            dispatchSelected({
                                                type: "SET_PLAYLIST",
                                                id: id,
                                            }),
                                        ),
                                    )
                            ) : filter == filterOptions.PUBLIC ? (
                                <p>TODO: Public spotify searching</p>
                            ) : (
                                <p>No filter selected</p>
                            )}
                            {filter == filterOptions.PLAYLISTS &&
                            playlistsQuery.hasNextPage &&
                            !playlistsQuery.isFetching ? (
                                <button
                                    onClick={() =>
                                        playlistsQuery.fetchNextPage()
                                    }
                                >
                                    load more
                                </button>
                            ) : null}
                            {playlistsQuery.isFetchingNextPage ? (
                                <p>loading your hearts desires.....</p>
                            ) : null}
                        </SearchItemList>
                    </div>
                )}
            </div>
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    left: "0",
                    bottom: "0",
                    padding: "0.6rem 1rem",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row-reverse",
                    gap: "1rem",
                }}
            >
                <button
                    style={{
                        borderRadius: "18px",
                        backgroundColor: "#6fb57e",
                        color: "#568c66",
                        borderStyle: "none",
                        fontSize: "1.2rem",
                        padding: "0 3rem",
                    }}
                    onClick={() => {
                        setSubmit("submitting...");
                        addItems(folderID, selected).then(closeModal);
                    }}
                >
                    {submit}
                </button>
                <button
                    style={{
                        borderRadius: "18px",
                        backgroundColor: "#b56f6f",
                        color: "#8e5555",
                        borderStyle: "none",
                        fontSize: "1.2rem",
                        padding: "2px 10px",
                    }}
                    onClick={closeModal}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </dialog>
    );
}
