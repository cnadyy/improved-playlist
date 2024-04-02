import { folders } from "@/api/firebase/collections";
import { Auth } from "@/api/firebase/createApp";
import Folder from "@/api/types/Folder";
import { getDocs, orderBy, query, where } from "firebase/firestore";

export default async function getUserFolders(): Promise<Folder[]> {
    const foldersQ = query(
        folders,
        where("owner", "==", Auth.currentUser!.uid),
        orderBy("name"),
    );

    return (await getDocs(foldersQ)).docs.map((f) => f.data()) as Folder[];
}
