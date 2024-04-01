import Folder from "@/api/types/Folder";
import { setDoc } from "firebase/firestore";
import { folderDoc } from "@fb/docs";

export default async function setFolder(folder: Folder): Promise<void> {
    await setDoc(folderDoc(folder.id), folder);
}
