import Folder from "./types/Folder";

/**
 *
 * @returns Returns the same folder[] ref as passed in
 */
export default function setFolderList(folders: Folder[]): Folder[] {
    localStorage.setItem("folderStore", JSON.stringify(folders));
    return folders;
}
