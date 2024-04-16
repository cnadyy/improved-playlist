import Folder from "../types/Folder";

const nameMatch = (folder: Folder, query: string) =>
    folder.name.toLowerCase().includes(query.toLowerCase());

/**
 * @returns boolean to be used in .filter
 */
export default function filterFolder(
    folder: Folder,
    searchEntry: string,
    pinned: FolderId[],
): boolean {
    return (
        pinned.includes(folder.id) &&
        (searchEntry ? nameMatch(folder, searchEntry) : true)
    );
}
