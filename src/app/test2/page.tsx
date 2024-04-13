"use client";

import React, { useState } from "react";
import AddItem from "@/components/newItems/AddItem";
import { Auth } from "@/api/firebase/createApp";
import FilterDialog from "@/components/newItems/FilterDialog";
import filterOptions from "@/api/types/FilterOptions";
import getFolder from "@fb/get/folder";
import Folder from "@/api/types/Folder";
import getUserFolders from "@/api/firebase/get/userFolders";
import fetch, { webAPIFetch } from "@api/spotify/fetch";
import Header from "@/components/Header";

export default function Test(): React.ReactNode {
    const [displayItemModal, setDisplayItemModal] = useState(false);
    const [dbData, setDbDAta] = useState<unknown | Folder>({});
    const [filter, setFilter] = useState<filterOptions>(filterOptions.NONE);
    const [fVisibile, setFvisible] = useState<boolean>(false);
    const [folderList, setFolderList] = useState<Folder[]>([]);

    const readSomeData = () =>
        getFolder("rtQhD7YGAqYpB6b9Kzwl").then(setDbDAta).catch(setDbDAta);
    const getList = () =>
        getUserFolders()
            .then(setFolderList)
            .catch((e) => console.log(e));

    const f1 = () =>
        webAPIFetch("me/player/play", {
            method: "PUT",
            body: JSON.stringify({
                uris: [
                    "spotify:track:38QnxZJMktnt96bxalqgEl",
                    "spotify:track:064wRZsHDLuoCJYw65gh7N",
                ],
            }),
        });
    const f2 = () =>
        webAPIFetch("me/player/play", {
            method: "PUT",
            body: JSON.stringify({
                context_uri: "spotify:playlist:0duznHNAXz1yJ5nFEPN3ox",
            }),
        });

    return (
        <div>
            <Header />
            <button onClick={f1}>f1</button>
            <button onClick={f2}>f2</button>
            <button onClick={() => setDisplayItemModal(true)}>
                Show the modal
            </button>
            {/*@ts-expect-error doesnt need an id for testing*/}
            <AddItem
                showModal={displayItemModal}
                closeModal={() => setDisplayItemModal(false)}
            />
            <button onClick={readSomeData}>Read some firebase data!</button>
            <button onClick={getList}>get user folders from firebase</button>
            <button onClick={() => setFvisible(true)}>Show the filters</button>
            <button
                onClick={() =>
                    fetch("playlists/2bN7qoysjyn8059Nkf8Zhz")
                        .then(console.log)
                        .catch(console.log)
                }
            >
                Fetch a playlist
            </button>
            <FilterDialog
                showFilters={fVisibile}
                closeFilters={() => setFvisible(false)}
                filter={filter}
                setFilter={(f) => setFilter(f)}
            />
            <p>{Auth.currentUser?.uid}</p>
            <p>{JSON.stringify(dbData)}</p>
            <ol>
                {folderList.map((f) => (
                    <li key={f.id}>{f.name}</li>
                ))}
            </ol>
        </div>
    );
}
