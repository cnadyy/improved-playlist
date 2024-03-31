import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { List, arrayMove } from "react-movable";
import { useContext } from "react";

import {
  FolderAction,
  FolderActionKind,
  FolderExplorerContext,
} from "./FolderContext";
import { moveTrail } from "@/utils";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
      folderID={rootId}
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
  setFolders(
    folders.map((f) => {
      if (f.id == folderID) {
        return {
          ...f,
          items: arrayMove(f.items, from, to),
        };
      } else {
        return f;
      }
    }),
  );
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
  folderID,
  isParentDisabled,
  trail,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  folderID: string;
  isParentDisabled: boolean;
  trail: number[];
}) {
  const { updateDisabledFolders, updateOpenedFolders } = useContext(
    FolderExplorerContext,
  );

  const folder = folders.find((f) => f.id == folderID);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  if (!folder) {
    return <>Invalid Folder?</>;
  }

  // let trailsToFolders = useMemo<{ trail: number[]; id: string }[]>(() => {
  //   return [];
  // }, []);

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter}>
        <SortableContext
          strategy={verticalListSortingStrategy}
          items={[0, 1, 2, 3]}
        >
          {folder.items.map((value, index) => {
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

            return (
              <FolderExplorerItem
                folders={folders}
                setFolders={setFolders}
                isParentDisabled={isParentDisabled}
                trail={itemTrail}
                item={item}
                id={index}
                key={t}
              />
            );
          })}
        </SortableContext>
        <DragOverlay>hi</DragOverlay>
      </DndContext>
    </>
  );
}

export { FolderExporer as default, DrawFolderList };
