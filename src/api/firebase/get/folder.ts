import Folder from "@/api/types/Folder";
import { getDoc } from "firebase/firestore";
import { folderDoc } from "@fb/docs";

export default async function getFolder(id: FolderId): Promise<Folder> {
    const folder = await getDoc(folderDoc(id));

    return folder.data() as Folder;
}
