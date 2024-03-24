import getFolderList from "./getFolderList";
import Folder from "./types/Folder";
import setFolderList from "./setFolderList";

// at some later point the localstorage api will be replaced with firebase
export default async function newFolder(pinned = false): Promise<FolderId> {
  const currentFolders = getFolderList();
  currentFolders.push({
    items: [],
    id: crypto.randomUUID(),
    name: "Default Folder",
    color: "#535620",
    isPinned: pinned,
  } as Folder);

  return (setFolderList(currentFolders).at(-1) as Folder).id;
}
