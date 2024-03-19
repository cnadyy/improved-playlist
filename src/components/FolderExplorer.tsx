import Folder, { SubitemKind } from "@/api/types/Folder";
import {
  faAngleDown,
  faAngleRight,
  faFolder,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  rootId,
}: {
  folders: Folder[];
  rootId: number;
}) {
  const [openedFolders, setOpenedFolders] = useState<string[]>([]);

  function toggleFolder(id: string) {
    const newOpenedFolders = [...openedFolders];
    const indexOf = openedFolders.indexOf(id);
    if (indexOf == -1) {
      newOpenedFolders.push(id);
    } else {
      newOpenedFolders.splice(indexOf, 1);
    }

    setOpenedFolders(newOpenedFolders);
  }

  function drawFolder(folder: Folder) {
    return (
      <>
        <ul style={{ listStyleType: "none" }}>
          {folder.items.map((item) => {
            if (item.kind == SubitemKind.Folder) {
              // Basically guarentee this, hope there is a way
              // for this to make sense in typescript
              const subfolder = folders.filter((f) => f.id == item.itemID)[0];
              const isSubfolderOpen = openedFolders.includes(item.itemID);
              const subitems = isSubfolderOpen && drawFolder(subfolder);
              const openIcon = isSubfolderOpen ? (
                <FontAwesomeIcon
                  style={{ paddingRight: 10 }}
                  color="gray"
                  icon={faAngleDown}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ paddingLeft: 2, paddingRight: 12 }}
                  color="gray"
                  icon={faAngleRight}
                />
              );
              return (
                <li key={subfolder.id}>
                  <a onClick={() => toggleFolder(item.itemID)}>
                    {openIcon}
                    <FontAwesomeIcon icon={faFolder} color="gray" />{" "}
                    {subfolder.name}
                  </a>
                  {subitems}
                </li>
              );
            } else {
              return (
                <li key={item.kind}>
                  <FontAwesomeIcon
                    style={{ paddingRight: 4 }}
                    icon={faMusic}
                    color="gray"
                  />{" "}
                  {item.itemID}
                </li>
              );
            }
          })}
        </ul>
      </>
    );
  }

  return drawFolder(folders[rootId]);
}

export default FolderExporer;
