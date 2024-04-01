import Folder, { Subitem, SubitemKind } from "@/api/types/Folder";
import {
  faFolder,
  faFolderOpen,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { FolderAction, FolderActionKind } from "./FolderContext";

export function getIcon(kind: SubitemKind, opened: boolean) {
  return kind == SubitemKind.SpotifyURI
    ? faMusic
    : opened
      ? faFolderOpen
      : faFolder;
}

export function moveTrails(
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
  const oldTrailInit = oldTrail.slice(0, oldTrail.length - 1).toString();
  const trailInit = trail.slice(0, oldTrail.length - 1).toString();
  if (
    oldTrailInit == trailInit &&
    oldTrail[oldTrail.length - 1] <= trail[oldTrail.length - 1]
  ) {
    movedTrail[oldTrail.length - 1] -= 1;
  }

  const newTrailInit = newTrail.slice(0, newTrail.length - 1).toString();
  const movedTrailInit = movedTrail.slice(0, newTrail.length - 1).toString();
  if (
    newTrailInit == movedTrailInit &&
    newTrail[newTrail.length - 1] <= movedTrail[newTrail.length - 1]
  ) {
    movedTrail[newTrail.length - 1] += 1;
  }
  return movedTrail;
}

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
