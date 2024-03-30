import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { List } from "react-movable";
import { useContext } from "react";

import {
  FolderAction,
  FolderActionKind,
  FolderExplorerContext,
} from "./FolderContext";
import { moveTrail } from "@/utils";
import setFolderList from "@/api/setFolderList";

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  setFolders,
  rootId,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  rootId: string;
}) {
  return (
    <DrawFolderList
      folders={folders}
      setFolders={setFolders}
      folder={folders.filter((folder) => folder.id == rootId)[0]}
      isParentDisabled={false}
      trail={[]}
    />
  );
}

function updateFolders(
  folders: Folder[],
  setFolders: (folders: Folder[]) => void,
  updateDisabledFolders: (action: FolderAction) => void,
  updateOpenedFolders: (action: FolderAction) => void,
  folderID: string,
  from: number,
  to: number,
  isRoot: boolean,
) {
  const newFolders = folders.map((f) => {
    if (f.id == folderID) {
      const elem = f.items.splice(from, 1);
      f.items.splice(to, 0, ...elem);
      return f;
    } else {
      return f;
    }
  });
  setFolders(newFolders);
  for (const i in trailsToFolders) {
    const folderTrail = trailsToFolders[i];
    if (folderTrail.id == folderID) {
      trailsToFolders = trailsToFolders.map((obj) => {
        return {
          id: obj.id,
          trail: moveTrail(
            obj.trail,
            [...folderTrail.trail, from],
            [...folderTrail.trail, to],
          ),
        };
      });
      updateDisabledFolders({
        kind: FolderActionKind.UpdateTrail,
        oldTrail: [...folderTrail.trail, from],
        newTrail: [...folderTrail.trail, to],
      });
      updateOpenedFolders({
        kind: FolderActionKind.UpdateTrail,
        oldTrail: [...folderTrail.trail, from],
        newTrail: [...folderTrail.trail, to],
      });
    }
  }
  if (isRoot) {
    trailsToFolders = trailsToFolders.map((obj) => {
      return {
        id: obj.id,
        trail: moveTrail(obj.trail, [from], [to]),
      };
    });
    updateDisabledFolders({
      kind: FolderActionKind.UpdateTrail,
      oldTrail: [from],
      newTrail: [to],
    });
    updateOpenedFolders({
      kind: FolderActionKind.UpdateTrail,
      oldTrail: [from],
      newTrail: [to],
    });
  }
}

let trailsToFolders: { trail: number[]; id: string }[] = [];

function DrawFolderList({
  folders,
  setFolders,
  folder,
  isParentDisabled,
  trail,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  folder: Folder;
  isParentDisabled: boolean;
  trail: number[];
}) {
  const { updateDisabledFolders, updateOpenedFolders } = useContext(
    FolderExplorerContext,
  );

  // let trailsToFolders = useMemo<{ trail: number[]; id: string }[]>(() => {
  //   return [];
  // }, []);

  return (
    <>
      <List
        lockVertically
        values={folder.items}
        beforeDrag={() => {
          // updateOpenedFolders({
          //   kind: FolderActionKind.Toggle,
          //   trail: [...trail, p.index],
          // });
        }}
        onChange={(meta) => {
          updateFolders(
            folders,
            setFolderList,
            updateDisabledFolders,
            updateOpenedFolders,
            folder.id,
            meta.oldIndex,
            meta.newIndex,
            trail.length == 0,
          );
        }}
        renderList={({ children, props }) => <div {...props}>{children}</div>}
        renderItem={({ value, props, index }) => {
          const item = value;
          const itemTrail = [...trail];
          if (index != undefined) {
            itemTrail.push(index);
          }

          let t = trailsToFolders.findIndex(
            (a) => a.trail.toString() == itemTrail.toString(),
          );
          if (t == -1) {
            t = trailsToFolders.length;
            trailsToFolders.push({ id: item.itemID, trail: itemTrail });
          }

          const obj = { key: undefined, ...props };
          return (
            <div {...obj} key={t}>
              {/*t*/}
              <FolderExplorerItem
                folders={folders}
                setFolders={setFolders}
                isParentDisabled={isParentDisabled}
                trail={itemTrail}
                item={item}
              />
            </div>
          );
        }}
      />
    </>
  );
}

export { FolderExporer as default, DrawFolderList };
