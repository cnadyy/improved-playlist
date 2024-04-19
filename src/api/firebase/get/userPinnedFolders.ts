import { Auth } from "@/api/firebase/createApp";
import { getUser } from "@/api/firebase/get/user";
import { pinnedFolders } from "@/api/firebase/queries";
import Folder from "@/api/types/Folder";
import { getDocs } from "firebase/firestore";

export default async function getUserPinnedFolders(): Promise<Folder[]> {
    const u = (await getUser(Auth.currentUser!.uid)) as User;

    if (u.pinned.length == 0) return [];

    return (await getDocs(pinnedFolders(u.pinned))).docs.map(
        (doc) => doc.data() as Folder,
    );
}
