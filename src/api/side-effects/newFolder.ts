import { Auth } from "@/api/firebase/createApp";
import setFolder from "@/api/firebase/set/folder";

/**
 * @returns id of newly created folder
 */
export default async function newFolder(pinned = false): Promise<FolderId> {
    const newFolder = {
        items: [],
        id: crypto.randomUUID(),
        name: "Default Folder",
        color: "#535620",
        isPinned: pinned,
        public: false,
        owner: Auth.currentUser!.uid,
    };

    return setFolder(newFolder).then(() => newFolder.id);
}
