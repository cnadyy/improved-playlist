import Folder, { SubitemKind } from "@/api/types/Folder";
import { css } from "@emotion/react";
import { faFolder, faMusic } from "@fortawesome/free-solid-svg-icons";
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

  function drawFolder(folder: Folder, isSubFolder: boolean) {
    return (
      <>
        <div>
          {folder.items.map((item) => {
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
              openedFolders.includes(item.itemID);

            const subitems =
              isSubfolderOpen &&
              drawFolder(folders.filter((f) => f.id == item.itemID)[0], true);

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
                    onClick={() => {
                      console.log("ters: " + id);
                      if (!isPlaylist) toggleFolder(id);
                    }}
                    css={css`
                      margin-bottom: 0.15rem;
                    `}
                  />{" "}
                  <div
                    css={css`
                      margin-left: 0.625rem;
                    `}
                  >
                    <a
                      css={css`
                        // font-size: ${isSubFolder ? "16px" : "20px"};
                      `}
                    >
                      {name}
                    </a>
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
                    onClick={() => {
                      if (!isPlaylist) toggleFolder(id);
                    }}
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

  return drawFolder(folders.filter((folder) => folder.id == rootId)[0], false);
}

export default FolderExporer;
