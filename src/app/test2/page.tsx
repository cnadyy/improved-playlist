"use client";

import setFolderList from "@/api/setFolderList";
import React, { useState } from "react";
import folders from "@mock/subfolders.json";
import AddItem from "@/components/newItems/AddItem";
import { Auth, Db } from "@/api/firebase/createApp";
import { doc, getDoc } from "firebase/firestore";
import FilterDialog from "@/components/newItems/FilterDialog";
import filterOptions from "@/api/types/FilterOptions";
import getFolder from "@fb/get/folder";
import Folder from "@/api/types/Folder";
import getUserFolders from "@/api/firebase/get/userFolders";
import getFolderList from "@/api/getFolderList";
import setFolder from "@/api/firebase/set/folder";

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

    const transfer = () =>
        setFolder({public: true, owner: "xBTkBIBePlc6PFR0EhqcEk5xLVp2", ...getFolderList()[0]})
            .then(() => console.log("set it"))
            .catch((e) => console.log(e));

    return (
        <div>
            <button onClick={() => setFolderList(folders)}>
                click me to set folder test data
            </button>
            <button onClick={() => setDisplayItemModal(true)}>
                Show the modal
            </button>
            <AddItem
                showModal={displayItemModal}
                closeModal={() => setDisplayItemModal(false)}
            />
            <button onClick={readSomeData}>Read some firebase data!</button>
            <button onClick={getList}>get user folders from firebase</button>
            <button onClick={transfer}>
                Set one of the localstorage mock playlists to firebase
            </button>
            <button onClick={() => setFvisible(true)}>Show the filters</button>
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
                    <li>{f.name}</li>
                ))}
            </ol>
        </div>
    );
}
