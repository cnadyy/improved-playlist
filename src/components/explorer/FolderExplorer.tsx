import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { List } from "react-movable";
import { useContext } from "react";
import { FolderActionKind, FolderExplorerContext } from "./FolderContext";

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
  const { updateDisabledFolders, updateOpenedFolders } =
    useContext(FolderExplorerContext);

  return (
    <>
      <List
        lockVertically
        values={folder.items}
        beforeDrag={(p) => {
          // setOpenedFolders(
          //   openedFolders.filter(
          //     (t) => t.toString() != [...trail, p.index].toString(),
          //   ),
          // );
        }}
        onChange={(meta) => {
          const newFolders = folders.map((f) => {
            if (f.id == folder.id) {
              const elem = f.items.splice(meta.oldIndex, 1);
              f.items.splice(meta.newIndex, 0, ...elem);
              return f;
            } else {
              return f;
            }
          });
          setFolders(newFolders);
          updateDisabledFolders({
            kind: FolderActionKind.UpdateTrail,
            oldTrail: [...trail, meta.oldIndex],
            newTrail: [...trail, meta.newIndex],
          });
          updateOpenedFolders({
            kind: FolderActionKind.UpdateTrail,
            oldTrail: [...trail, meta.oldIndex],
            newTrail: [...trail, meta.newIndex],
          });
        }}
        renderList={({ children, props }) => <div {...props}>{children}</div>}
        renderItem={({ value, props, index }) => {
          const item = value;
          const itemTrail = [...trail];
          if (index != undefined) {
            itemTrail.push(index);
          }

          return (
            <div {...props}>
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
