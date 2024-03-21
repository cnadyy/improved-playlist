import getFolderList from "./getFolderList";
import Folder from "./types/Folder";
import setFolderList from "./setFolderList";

// at some later point the localstorage api will be replaced with firebase
export default async function newFolder(): Promise<FolderId> {
  const currentFolders = getFolderList();
  currentFolders.push({
    items: [],
    id: crypto.randomUUID(),
    name: "Default Folder",
    color: "#535620",
  } as Folder);

  return (setFolderList(currentFolders).at(-1) as Folder).id;
}
