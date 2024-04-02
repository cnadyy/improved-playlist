import { useEffect, useState } from "react";
import Folder from "@/api/types/Folder";
import { onSnapshot } from "firebase/firestore";
import { userFolders } from "@/api/firebase/queries";

/**
 * @returns Folder[] after NOT cached retrival from Firestore
 */
export default function useUserFolders(): Folder[] {
    const [folders, setFolders] = useState<Folder[]>([]);

    useEffect(() => {
        // create event listener for user folders
        // includes latency compenstation: new writes call this before they hit the server
        onSnapshot(userFolders(), (snapshot) => {
            const newFolders = snapshot.docs.map((f) => f.data() as Folder);
            setFolders(newFolders);
        });
    }, []);

    return folders;
}
