import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { List } from "react-movable";
import moveTrail from "@/utils";

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  setFolders,
  rootId,
  disabledFolders,
  setDisabledFolders,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  rootId: string;
  disabledFolders: number[][];
  setDisabledFolders: (folders: number[][]) => void;
}) {
  return (
    <DrawFolderList
      folders={folders}
      setFolders={setFolders}
      folder={folders.filter((folder) => folder.id == rootId)[0]}
      isRoot={true}
      isParentDisabled={false}
      trail={[]}
      disabled={disabledFolders}
      setDisabled={setDisabledFolders}
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
  disabled,
  setDisabled,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  folder: Folder;
  isRoot: boolean;
  isParentDisabled: boolean;
  trail: number[];
  disabled: number[][];
  setDisabled: (disabled: number[][]) => void;
}) {
  return (
    <>
      <List
        lockVertically
        values={folder.items}
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
          setDisabled(
            moveTrail(
              disabled,
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
            <>
              <div {...props}>
                <FolderExplorerItem
                  folders={folders}
                  setFolders={setFolders}
                  isRoot={isRoot}
                  isParentDisabled={isParentDisabled}
                  trail={itemTrail}
                  item={item}
                  disabled={disabled}
                  setDisabled={setDisabled}
                />
              </div>
            </>
          );
        }}
      />
    </>
  );
}

export { FolderExporer as default, DrawFolderList };
