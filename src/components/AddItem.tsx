import React, { CSSProperties, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchItemList from "./SearchItemList";
import Folder from "@/api/types/Folder";
import getFolderList from "@/api/getFolderList";
import lineClamp from "@/css/LineClamp";
import UserPlaylistExplorer from "@/api/UserPlaylistExplorer";
import HideScrollBar from "@/css/HideScrollBar";

const AddItemStyles: CSSProperties = {
    maxWidth: "750px",
    width: "750px",
    padding: "0",
    maxHeight: "65vh",
}

/**
 * 
 * @param showModal used to indicate if the modal should be open
 * @param closeModal called when the close button is pressed in the modal
 * @returns dialog component that is hidden by default
 */
export default function AddItem({ showModal, closeModal }: { showModal: boolean, closeModal: () => void}): React.ReactNode {
    const ref = useRef<HTMLDialogElement>(null);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("");
    const [folderList, setFolderList] = useState<Folder[]>([]);
    const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [controller, setController] = useState<UserPlaylistExplorer | null>(null);

    useEffect(() => {
        if(showModal) ref.current?.showModal();
        else ref.current?.close();
    }, [showModal])

    // playlist fetching
    useEffect(() => {
        setController(new UserPlaylistExplorer());
    }, []);

    useEffect(() => {
        if (controller) controller.getPlaylists().then(setPlaylists);
    }, [controller]);

    // folder fetching
    useEffect(() => {
        setFolderList(getFolderList());
    }, []);

    return (
        <dialog ref={ref} onCancel={closeModal} style={AddItemStyles}>
            <div style={{maxHeight: "65vh", overflowY: "scroll", overflowX: "hidden", boxSizing: "border-box", padding: "1.5rem 2rem 2rem", ...HideScrollBar}}>
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    <SearchBar entry={query} setEntry={setQuery} style={{ width: "90%", boxSizing: "border-box", height: "2.5rem"}}/>
                </div>
                {!filter ?
                    <div>
                        <SearchItemList name="Folders">
                            {folderList.map(f => (
                                <div style={{ minWidth: "8rem"}} key={f.id}>
                                    <div style={{width: "8rem", aspectRatio: "1/1", backgroundColor: f.color}} />
                                    <p style={lineClamp}>{f.name}</p>
                                </div>
                            ))}
                        </SearchItemList>
                        <SearchItemList name="Playlists">
                            {playlists.map(p => (
                                <div style={{ minWidth: "8rem"}} key={p.id}>
                                    { p.images.length != 0 ?
                                        <img src={p.images[0]?.url} style={{width: "8rem"}}/> :
                                        <div style={{ backgroundColor: "grey", width: "8rem", height: "8rem"}}/>
                                    }
                                    <p style={lineClamp}>{p.name}</p>
                                </div>
                            ))}
                        </SearchItemList>
                    </div> :
                    <ul>
                        {/* some items will reside in here */}
                    </ul>
                }
            </div>
            <div style={{position: "absolute", width: "100%", left: "0", bottom: "0", backgroundColor: "rgb(98, 114, 164)", padding: "0.3rem", boxSizing: "border-box", display: "flex", flexDirection: "row-reverse", gap: "1rem"}}>
                <button style={{
                    borderRadius: "2px",
                    backgroundColor: "white",
                    borderStyle: "none",
                    fontSize: "1.2rem"
                    }} 
                    onClick={closeModal}
                    >
                    Save and quit
                </button>
                <button style={{
                    borderRadius: "2px",
                    backgroundColor: "red",
                    borderStyle: "none",
                    fontSize: "1.2rem"
                    }} 
                    onClick={closeModal}
                    >
                    Discard changes and encourge designer to decide on colours
                </button>
            </div>
        </dialog>
    )
}