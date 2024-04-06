import { useEffect, useState } from "react";
import Folder from "@/api/types/Folder";
import { onSnapshot } from "firebase/firestore";
import { userFolders } from "@/api/firebase/queries";
import storeSetFolder from "@/api/firebase/set/folder";

/**
 * @info listens for new updates on the server
 * @returns Folder[] after NOT cached retrival from Firestore
 * @returns setFolder can be used to update a folder on the server with a faster reflection in folders, but prefer directly calling firestore setFolder
 */
export default function useUserFolders(): [Folder[], (folder: Folder) => void] {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        // create event listener for user folders
        // includes latency compenstation: new writes call this before they hit the server
        onSnapshot(userFolders(), (snapshot) => {
            const newFolders = snapshot.docs.map((f) => f.data() as Folder);
            setFolders(newFolders);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setFolder = (f: Folder) => {
        // update the state synchronously and immediately with the potential
        // to be overwritten by the event listener
        setFolders(folders.map((oldF) => (oldF.id == f.id ? f : oldF)));
        storeSetFolder(f);
    };

    return [folders, setFolder];
}
