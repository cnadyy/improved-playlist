import React, { CSSProperties, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchItemList from "./SearchItemList";
import FolderComponent from "./FolderComponent";
import Folder from "@/api/types/Folder";
import getFolderList from "@/api/getFolderList";

const AddItemStyles: CSSProperties = {
    maxWidth: "750px",
    width: "750px",
    padding: "1.5rem 2rem 2rem",
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

    useEffect(() => {
        if(showModal) ref.current?.showModal();
        else ref.current?.close();
    }, [showModal])

    // folder fetching
    useEffect(() => {
        setFolderList(getFolderList())
    }, [])

    return (
        <dialog ref={ref} onCancel={closeModal} style={AddItemStyles}>
            <div>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <SearchBar entry={query} setEntry={setQuery} style={{ width: "90%", boxSizing: "border-box", height: "2.5rem"}}/>
            </div>
            {!filter ?
                <div>
                    <SearchItemList name="Folders">
                        {folderList.map(f => <p>{f.name}</p>)}
                    </SearchItemList>
                    <SearchItemList name="Playlists">
                        <p>test</p>
                    </SearchItemList>
                </div> :
                <ul>
                    {/* some items will reside in here */}
                </ul>
            }
            </div>

                <button style={{
                    borderRadius: "2px",
                    backgroundColor: "white",
                    borderStyle: "none",
                    fontSize: "1rem"
                    }} 
                    onClick={closeModal}
                    >
                    Save and quit
                </button>
        </dialog>
    )
}