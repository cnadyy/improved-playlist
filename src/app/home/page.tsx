"use client";

import FolderComponent from "@/components/FolderComponent";
import Folder from "@/api/types/Folder";
import { CSSProperties, useEffect, useState } from "react";
import NewFolder from "@/components/NewFolderComponent";
import getFolderList from "@/api/getFolderList";
import Link from "next/link";
import Header from "@/components/Header";
import filterFolder from "@/api/search-functions/filterFolders";

const folderListStyle: CSSProperties = {
  display: "flex",
  gap: "1rem",
  flexWrap: "wrap",
  padding: "0",
  margin: "0",
};

export default function Folders() {
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [searchEntry, setSearchEntry] = useState<string>("");

  useEffect(() => {
    setFolderList(getFolderList());
  }, []);

  const filteredFolders = folderList.filter((f) =>
    filterFolder(f, searchEntry),
  );

  return (
    <>
      <Header
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
        styling={{ backgroundColor: "white" }}
      >
        <NewFolder />
      </Header>
      <div style={{ padding: "0 2rem" }}>
        {filteredFolders.length ? (
          <ul style={folderListStyle}>
            {filteredFolders.map((folder) => (
              <li key={folder.id} style={{ listStyle: "none" }}>
                <Link
                  href={"/playback?id=" + folder.id}
                  style={{ all: "unset" }}
                >
                  <FolderComponent data={folder} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <h1
            style={{
              backgroundImage: "linear-gradient(indigo, green)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            No folders found! Try creating the folder you seek
          </h1>
        )}
      </div>
    </>
  );
}
