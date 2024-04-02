import Folder from "@/api/types/Folder";
import { getDocFromCache } from "firebase/firestore";
import { folderDoc } from "@fb/docs";
import getFolder from "@/api/firebase/get/folder";

/**
 * @returns attempts to return cached doc, otherwise retrives latest
 */
export default async function getCachedFolder(id: FolderId): Promise<Folder> {
    try {
        const folder = await getDocFromCache(folderDoc(id));
        return folder.data() as Folder;
    } catch {
        return await getFolder(id);
    }
}
