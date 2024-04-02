import { userFolders } from "@/api/firebase/queries";
import Folder from "@/api/types/Folder";
import { getDocs } from "firebase/firestore";

export default async function getUserFolders(): Promise<Folder[]> {
    return (await getDocs(userFolders())).docs.map((f) => f.data()) as Folder[];
}
