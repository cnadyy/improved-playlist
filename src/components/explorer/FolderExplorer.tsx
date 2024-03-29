import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { List } from "react-movable";
import moveTrail from "@/utils";
import { useContext } from "react";
import { FolderContext } from "./FolderContext";

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
      isRoot={true}
      isParentDisabled={false}
      trail={[]}
    />
  );
}

function DrawFolderList({
  folders,
  setFolders,
  folder,
  isRoot,
  isParentDisabled,
  trail,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  folder: Folder;
  isRoot: boolean;
  isParentDisabled: boolean;
  trail: number[];
}) {
  const {
    disabledFolders,
    setDisabledFolders,
    openedFolders,
    setOpenedFolders,
  } = useContext(FolderContext);

  return (
    <>
      <List
        lockVertically
        values={folder.items}
        beforeDrag={(p) => {
          setOpenedFolders(
            openedFolders.filter(
              (t) => t.toString() != [...trail, p.index].toString(),
            ),
          );
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
          setDisabledFolders(
            moveTrail(
              disabledFolders,
              [...trail, meta.oldIndex],
              [...trail, meta.newIndex],
            ),
          );
          setOpenedFolders(
            moveTrail(
              openedFolders,
              [...trail, meta.oldIndex],
              [...trail, meta.newIndex],
            ),
          );
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
                isRoot={isRoot}
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
