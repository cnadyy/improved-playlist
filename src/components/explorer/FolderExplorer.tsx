import Folder, { SubitemKind } from "@/api/types/Folder";
import {
  faFolder,
  faFolderOpen,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import FolderExplorerItem from "./FolderExplorerItem";
import { List } from "react-movable";
// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  rootId,
  disabledFolders,
  setDisabledFolders,
}: {
  folders: Folder[];
  rootId: string;
  disabledFolders: Set<string>;
  setDisabledFolders: (folders: Set<string>) => void;
}) {
  // NOTE: This uses the position from the element to the root
  // Hence, when swapping elements we must take to make sure
  // it matches up in these sets.
  const [openedFolders, setOpenedFolders] = useState<Set<string>>(
    () => new Set(),
  );
  const uniqueIDs = new Map<string, string>();
  const repeated = new Map<string, number>();

  function toggleOpenFolder(trail: string) {
    const newOpenedFolders = new Set(openedFolders);
    if (!openedFolders.has(trail)) {
      newOpenedFolders.add(trail);
    } else {
      newOpenedFolders.delete(trail);
    }

    setOpenedFolders(newOpenedFolders);
  }

  function toggleDisableFolder(trail: string) {
    const newDisabledFolders = new Set(disabledFolders);
    if (!disabledFolders.has(trail)) {
      newDisabledFolders.add(trail);
    } else {
      newDisabledFolders.delete(trail);
    }

    console.log(newDisabledFolders);

    setDisabledFolders(newDisabledFolders);
  }

  function moveFolder(oldTrail: number[], newTrail: number[]) {}

  function generateIDs(trail: string, id: string): string {
    const value = uniqueIDs.get(trail);
    if (value) {
      return value;
    } else {
      let repeat = repeated.get(id);
      if (!repeat) {
        repeat = 0;
      }
      repeated.set(id, repeat + 1);
      return id + "-" + repeat;
    }
  }

  function drawFolder(
    folder: Folder,
    isRoot: boolean,
    isParentDisabled: boolean,
    trail: number[],
  ) {
    return (
      <>
        <List
          lockVertically
          values={folder.items}
          onChange={() => {}}
          renderList={({ children, props }) => <div {...props}>{children}</div>}
          renderItem={({ value, props, index }) => {
            const item = value;
            if (index != undefined) {
              trail.push(index);
            }
            const isPlaylist = item.kind == SubitemKind.SpotifyURI;

            const isSubfolderOpen =
              item.kind != SubitemKind.SpotifyURI &&
              openedFolders.has(trail.toString());

            const icon = isPlaylist
              ? faMusic
              : isSubfolderOpen
                ? faFolderOpen
                : faFolder;

            const isLocallyDisabled = disabledFolders.has(trail.toString());
            const isDisabled = isParentDisabled || isLocallyDisabled;

            const subitems =
              isSubfolderOpen &&
              drawFolder(
                folders.filter((f) => f.id == item.itemID)[0],
                false,
                isDisabled,
                [...trail],
              );

            const currItemTrail = [...trail];
            const onOpenClick = () => {
              if (!isPlaylist) toggleOpenFolder(currItemTrail.toString());
            };
            const onDisableClick = () => {
              toggleDisableFolder(currItemTrail.toString());
            };

            if (index != undefined) {
              trail.pop();
            }

            return (
              <>
                <div {...props}>
                  <FolderExplorerItem
                    isRoot={isRoot}
                    onOpenClick={onOpenClick}
                    isDisabled={isDisabled}
                    isLocallyDisabled={isLocallyDisabled}
                    isPlaylist={isPlaylist}
                    onDisableClick={onDisableClick}
                    item={item}
                    icon={icon}
                    subitems={subitems}
                  />
                </div>
              </>
            );
          }}
        />
      </>
    );
  }

  return drawFolder(
    folders.filter((folder) => folder.id == rootId)[0],
    true,
    false,
    [],
  );
}

export default FolderExporer;
