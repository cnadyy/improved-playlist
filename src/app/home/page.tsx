"use client";

import FolderComponent from "@/components/FolderComponent";
import Folder from "@/api/types/Folder";
import { CSSProperties, useEffect, useState } from "react";
import folders from "@mock/subfolders.json";
import HideScrollBar from "@/css/HideScrollBar";
import { handleClientScriptLoad } from "next/script";
import NewFolder from "@/components/NewFolderComponent";
import getFolderList from "@/api/getFolderList";
import SearchBar from "@/components/SearchBar";

const folderListStyle: CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  padding: "0",
};

const bannerStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  columnGap: "4rem",
  rowGap: "1rem",
  padding: "0 2rem",
  boxSizing: "border-box",
};

const bannerItemStyle: CSSProperties = {
  height: "3rem",
  boxSizing: "border-box",
};

export default function Folders() {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [searchEntry, setSearchEntry] = useState<string>("");

  useEffect(() => {
    setFolderList(getFolderList());
  }, []);

  return (
    <>
      <div style={bannerStyle}>
        <p style={{textWrap: "nowrap"}}>Improved spotify playlists</p>
        <SearchBar entry={searchEntry} setEntry={setSearchEntry} style={{flex: 1, ...bannerItemStyle}} />
        <NewFolder style={bannerItemStyle} />
      </div>
      <div style={{ padding: "0 2rem" }}>
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
    </>
  );
}
