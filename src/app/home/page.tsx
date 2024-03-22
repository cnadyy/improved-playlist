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
  /** Note that when setting the id it should be prefixed with an a */
  const [animation, setAnimation] = useState<string>("#impossibleHash");
  const [dataLoadedBefore, setDataLoadedBefore] = useState<boolean>(false);

  useEffect(() => {
    setFolderList(getFolderList());
  }, []);

  useEffect(() => {
    // retrigger browser scrolling to correct spot after content has loaded
    if (!dataLoadedBefore && folderList.length != 0) {
      const hash = location.hash;
      window.location.hash = "";
      window.location.hash = hash;
      setDataLoadedBefore(true);
    }
  }, [folderList]);

  // trigger hash change animation
  useEffect(() => {
    const handleHashChange = () => {
      // add arbitrary letter to make a valid id name
      setAnimation(location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div style={{ padding: "0 2rem" }}>
      <div style={bannerStyle}>
        <p>Improved spotify playlists</p>
        <NewFolder />
      </div>
      <style>{`
        @keyframes fadeRed {
          0%, 100%   {color: unset;}
          30%, 75%  {color: red;}
        }

        @keyframes saturate {
          0%, 100%   {filter: saturate(0.4);}
          30%, 75%  {filter: saturate(1);}
        }

        li${animation} {
          animation-name: fadeRed;
          animation-duration: 3s;
        }

        li${animation} > div > .folderIcon {
          animation-name: saturate;
          animation-duration: 3s;
        }
      `}</style>
      <ul style={folderListStyle}>
        {folderList
          .filter(folder => folder.isPinned)
          .map(folder => (
          <li
            id={"a" + folder.id}
            key={folder.id}
            style={{ listStyle: "none", scrollMarginTop: "100px" }}
          >
            <FolderComponent data={folder} />
          </li>
        ))}
      </ul>
    </div>
  );
}
