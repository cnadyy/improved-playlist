import Folder, { SubitemKind } from "@/api/types/Folder";
import { css } from "@emotion/react";
import {
  faEdit,
  faFolder,
  faMusic,
  faToggleOn,
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
  rootId: string;
}) {
  // NOTE: This uses the position from the element to the root
  // Hence, when swapping elements we must take to make sure
  // it matches up in these sets.
  //
  // We could also use this technique for storing unique keys
  // (probably adding an index at the end or something...)
  // However, again take care when swapping elements.
  const [openedFolders, setOpenedFolders] = useState<Set<string>>(
    () => new Set(),
  );

  function toggleFolder(trail: string) {
    const newOpenedFolders = new Set(openedFolders);
    if (!openedFolders.has(trail)) {
      newOpenedFolders.add(trail);
    } else {
      newOpenedFolders.delete(trail);
    }

    console.log(openedFolders);

    setOpenedFolders(newOpenedFolders);
  }

  function drawFolder(folder: Folder, isSubFolder: boolean, trail: number[]) {
    return (
      <>
        <div>
          {folder.items.map((item, i) => {
            trail.push(i);
            const isPlaylist = item.kind == SubitemKind.SpotifyURI;
            const name = isPlaylist
              ? item.itemID
              : folders.filter((f) => f.id == item.itemID)[0].name;

            const id = isPlaylist
              ? item.itemID
              : folders.filter((f) => f.id == item.itemID)[0].id;

            const icon = isPlaylist ? faMusic : faFolder;

            const isSubfolderOpen =
              item.kind != SubitemKind.SpotifyURI &&
              openedFolders.has(trail.toString());

            const subitems =
              isSubfolderOpen &&
              drawFolder(
                folders.filter((f) => f.id == item.itemID)[0],
                true,
                trail,
              );

            const currItemTrail = [...trail];
            const toggleClick = () => {
              if (!isPlaylist) toggleFolder(currItemTrail.toString());
            };

            trail.pop();

            return (
              <div key={id}>
                <div
                  css={css`
                    display: grid;
                    align-items: center;
                    grid-template-rows: min-content auto;
                    grid-template-columns: min-content auto;
                    margin-left: 0.75rem;
                    margin-top: 0.15rem;
                    font-size: ${isSubFolder ? "0.9em" : "1.2rem"};
                  `}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    color="gray"
                    size={isSubFolder ? "lg" : "2x"}
                    onClick={toggleClick}
                    css={css`
                      margin-bottom: 0.15rem;
                      cursor: pointer;
                    `}
                  />{" "}
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-left: 0.625rem;
                      padding: 0.25rem;
                      border: solid 0.5px #ffffff;
                      &:hover {
                        background-color: #dddddd;
                        border-color: #444444;
                        border-radius: 4px;
                      }
                    `}
                  >
                    <div>{name}</div>
                    <div
                      css={css`
                        font-size: 1rem;
                      `}
                    >
                      <FontAwesomeIcon icon={faToggleOn} />
                    </div>
                  </div>
                  <div
                    css={css`
                      display: flex;
                      justify-content: center;
                      height: 100%;
                      width: 100%;
                      cursor: pointer;
                      &:hover div {
                        border: solid 2px;
                        border-color: black;
                        border-top-width: 0px;
                        border-bottom-width: 0px;
                      }
                    `}
                    onClick={toggleClick}
                  >
                    <div
                      css={css`
                        // background-color: black;
                        height: 100%;
                        border: solid 1px;
                        border-color: gray;
                        border-top-width: 0px;
                        border-bottom-width: 0px;
                        border-radius: 10px;
                      `}
                    ></div>
                  </div>
                  <div>{subitems}</div>
                </div>
              </div>
            );
            // } else {
            //   return (
            //     <div key={item.kind}>
            //       <FontAwesomeIcon
            //         style={{ paddingRight: 4 }}
            //         icon={faMusic}
            //         color="gray"
            //       />{" "}
            //       {item.itemID}
            //     </div>
            //   );
            // }
          })}
        </div>
      </>
    );
  }

  return drawFolder(
    folders.filter((folder) => folder.id == rootId)[0],
    false,
    [],
  );
}

export default FolderExporer;
