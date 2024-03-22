"use client";

import FolderComponent from "@/components/FolderComponent";
import Folder from "@/api/types/Folder";
import { CSSProperties, useEffect, useState } from "react";
import folders from "@mock/subfolders.json";
import HideScrollBar from "@/css/HideScrollBar";
import { handleClientScriptLoad } from "next/script";
import NewFolder from "@/components/NewFolderComponent";
import getFolderList from "@/api/getFolderList";

const folderListStyle: CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  padding: "0",
};

const bannerStyle: CSSProperties = {
  height: "3rem",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
};

export default function Folders() {
  const [folderList, setFolderList] = useState<Folder[]>([]);

  useEffect(() => {
    setFolderList(getFolderList());
  }, []);

  return (
    <div style={{ padding: "0 2rem" }}>
      <div style={bannerStyle}>
        <p>Improved spotify playlists</p>
        <NewFolder />
      </div>
      <ul style={folderListStyle}>
        {folderList
          .filter(folder => folder.isPinned)
          .map(folder => (
          <li
            key={folder.id}
            style={{ listStyle: "none" }}
          >
            <FolderComponent data={folder} />
          </li>
        ))}
      </ul>
    </div>
  );
}
