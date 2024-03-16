"use client";

import FolderComponent from "@/components/FolderComponent";
import Folder from "@/api/types/Folder";
import { CSSProperties, useEffect, useState } from "react";
import folders from "@mock/folders.json";
import HideScrollBar from "@/css/HideScrollBar";

const folderListStyle: CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
};

export default function Folders() {
  const [folderList, setFolderList] = useState<Folder[]>([]);

  useEffect(() => {
    setFolderList(folders);
  }, []);

  return (
    <div>
      <ul style={folderListStyle}>
        {folderList.map((folder) => (
          <li key={folder.id} style={{ listStyle: "none" }}>
            <FolderComponent data={folder} />
          </li>
        ))}
      </ul>
      <h1>This should contain:</h1>
      <ol>
        <li>An add folder button</li>
      </ol>
    </div>
  );
}
