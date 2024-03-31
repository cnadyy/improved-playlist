import Folder, { Subitem } from "./api/types/Folder";
import {
  FolderAction,
  FolderActionKind,
} from "./components/explorer/FolderContext";

export default function moveTrails(
  disabled: number[][],
  oldTrail: number[],
  newTrail: number[],
) {
  return disabled.map((trail) => moveTrail(trail, oldTrail, newTrail));
}

export function moveTrail(
  trail: number[],
  oldTrail: number[],
  newTrail: number[],
) {
  if (trail.toString() == oldTrail.toString()) {
    return newTrail;
  }
  if (oldTrail.toString() == trail.slice(0, oldTrail.length).toString()) {
    return [...newTrail, ...trail.slice(oldTrail.length)];
  }
  const movedTrail = [...trail];
  if (
    oldTrail.slice(0, oldTrail.length - 1).toString() ==
      trail.slice(0, oldTrail.length - 1).toString() &&
    oldTrail[oldTrail.length - 1] <= trail[oldTrail.length - 1]
  ) {
    movedTrail[oldTrail.length - 1] -= 1;
  }

  if (
    newTrail.slice(0, newTrail.length - 1).toString() ==
      movedTrail.slice(0, newTrail.length - 1).toString() &&
    newTrail[newTrail.length - 1] <= movedTrail[newTrail.length - 1]
  ) {
    movedTrail[newTrail.length - 1] += 1;
  }
  return movedTrail;
}

// // FIXME: consider this example
// // Should this return [[6, 5, 6]] or [6, 4, 6]
// console.log(moveTrail([[7, 4, 6]], [3], [7, 4]));

// console.log(moveTrail([[3, 4, 6]], [3], [7]));

export function updateFolders(
  trails: { trail: number[]; item: Subitem }[],
  setTrails: (trails: { trail: number[]; item: Subitem }[]) => void,
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
  for (const i in trails) {
    const folderTrail = trails[i];
    if (folderTrail.item.itemID == folderID) {
      console.log(folderTrail);
      trails = trails.map((obj) => {
        return {
          ...obj,
          trail: moveTrail(
            obj.trail,
            [...folderTrail.trail, from],
            [...folderTrail.trail, to],
          ),
        };
      });
      setTrails(trails);
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
    setTrails(
      trails.map((obj) => {
        return {
          ...obj,
          trail: moveTrail(obj.trail, [from], [to]),
        };
      }),
    );
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
