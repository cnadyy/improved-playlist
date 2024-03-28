import { useEffect, useState } from "react";
import Folder from "./types/Folder";

function getFolderList(): Folder[] {
  const item = localStorage.getItem("folderStore");
  return item ? (JSON.parse(item) as Folder[]) : [];
}

function useFolderList(): [Folder[], (folders: Folder[]) => void] {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    const item = localStorage.getItem("folderStore");
    setFolders(item ? (JSON.parse(item) as Folder[]) : []);
  }, []);

  return [folders, setFolders];
}

export { getFolderList as default, useFolderList };
