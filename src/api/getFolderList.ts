import { useEffect, useState } from "react";
import Folder from "./types/Folder";
import setFolderList from "./setFolderList";

function getFolderList(): Folder[] {
    const item = localStorage.getItem("folderStore");
    return item ? (JSON.parse(item) as Folder[]) : [];
}

function useFolderList(): [Folder[], (folders: Folder[]) => void] {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        const item = localStorage.getItem("folderStore");
        setFolders(item ? (JSON.parse(item) as Folder[]) : []);
    }, []);

    function setFolder(folders: Folder[]) {
        setFolders(folders);
        setFolderList(folders);
    }

    return [folders, setFolder];
}

export { getFolderList as default, useFolderList };
