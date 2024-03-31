import Folder from "@/api/types/Folder";
import FolderExplorerItem from "./FolderExplorerItem";
import { arrayMove } from "react-movable";
import { useContext } from "react";

import {
  FolderAction,
  FolderActionKind,
  FolderExplorerContext,
} from "./FolderContext";
import { moveTrail, updateFolders } from "@/utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

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

let trails: { trail: number[]; id: string }[] = [];

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
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  if (!folder) {
    return <>Invalid Folder?</>;
  }

  function handleStart(e: DragStartEvent) {
    updateOpenedFolders({
      kind: FolderActionKind.Set,
      trail: trails[Number(e.active.id)].trail,
      value: false,
    });
  }

  function handleEnd(e: DragEndEvent) {
    console.log(e);
    if (e.over && folder) {
      updateFolders(
        trails,
        (f) => {
          trails = f;
        },
        folders,
        setFolders,
        updateDisabledFolders,
        updateOpenedFolders,
        folder.id,
        trails[Number(e.active.id)].trail[
          trails[Number(e.active.id)].trail.length - 1
        ],
        trails[Number(e.over.id)].trail[
          trails[Number(e.over.id)].trail.length - 1
        ],
        trail.length == 0,
      );
    }
  }

  const items = folder.items.map((value, index) => {
    const item = value;
    const itemTrail = [...trail];
    if (index != undefined) {
      itemTrail.push(index);
    }

    let key = trails.findIndex(
      (a) => a.trail.toString() == itemTrail.toString(),
    );
    if (key == -1) {
      key = trails.length;
      trails.push({ id: item.itemID, trail: itemTrail });
    }
    if (key == 0) {
      return "0";
    }
    return key;
  });

  return (
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        collisionDetection={closestCenter}
        onDragEnd={handleEnd}
        onDragStart={handleStart}
      >
        <SortableContext strategy={verticalListSortingStrategy} items={items}>
          <div style={{ display: "grid" }}>
            {folder.items.map((value, index) => {
              const item = value;
              const itemTrail = [...trail];
              if (index != undefined) {
                itemTrail.push(index);
              }

              const key = items[index];

              return (
                <>
                  {/*key*/}
                  <FolderExplorerItem
                    folders={folders}
                    setFolders={setFolders}
                    isParentDisabled={isParentDisabled}
                    trail={itemTrail}
                    item={item}
                    id={key}
                    key={key}
                  />
                </>
              );
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "orange",
              height: "100%",
            }}
          >
            hi
          </div>
        </DragOverlay>
      </DndContext>
    </>
  );
}

export { FolderExporer as default, DrawFolderList };
