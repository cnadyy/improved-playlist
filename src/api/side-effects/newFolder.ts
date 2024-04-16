import { Auth } from "@/api/firebase/createApp";
import setFolder from "@/api/firebase/set/folder";
import { getUser } from "../firebase/get/user";
import setUser from "../firebase/set/user";

/**
 * @returns id of newly created folder
 */
export default async function newFolder(pinned = false): Promise<FolderId> {
    const newFolder = {
        items: [],
        id: crypto.randomUUID(),
        name: "Default Folder",
        color: "#535620",
        public: false,
        owner: Auth.currentUser!.uid,
    };

    if (pinned) {
        const user = await getUser(Auth.currentUser!.uid);
        const u = { ...user };
        u.pinned.push(newFolder.id);
        await setUser(u);
    }

    return setFolder(newFolder).then(() => newFolder.id);
}
