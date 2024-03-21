import { useEffect, useState } from "react";
import Folder from "./types/Folder";

function getFolderList(): Folder[] {
  const item = localStorage.getItem("folderStore");
  return item ? (JSON.parse(item) as Folder[]) : [];
}

function useFolderList() {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("folderStore");
    setFolders(item ? (JSON.parse(item) as Folder[]) : []);
  }, []);

  return folders;
}

export { getFolderList as default, useFolderList };
