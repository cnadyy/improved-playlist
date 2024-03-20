import Folder from "./types/Folder";

export default function getFolderList(): Folder[] {
    let item = localStorage.getItem("folderStore");
    return item ? JSON.parse(item) as Folder[] : [];
}
