import folders from "@mock/subfolders.json";
import Folder from "./types/Folder";

export default async function getFolder(id: string): Promise<Folder> {
    return folders.filter(f => f.id == id)[0] as Folder;
}