import getFolderList from "./getFolderList";
import Folder from "./types/Folder";

export default async function getFolder(id: string): Promise<Folder> {
    try {
        const folders = getFolderList();
        return folders.find((f) => f.id == id) as Folder;
    } catch {
        const err = new Error("No folder found with that ID");
        Object.assign(err, {
            explain:
                "You may not have access to this folder or it may not exist",
        });
        throw err;
    }
}
