import { moveTrails } from "@/components/explorer/FolderUtils";
import { createContext } from "react";

export const FolderExplorerContext = createContext<{
  disabledFolders: number[][];
  updateDisabledFolders: (action: FolderAction) => void;
  openedFolders: number[][];
  updateOpenedFolders: (action: FolderAction) => void;
}>({
  disabledFolders: [],
  updateDisabledFolders: () => {},
  openedFolders: [],
  updateOpenedFolders: () => {},
});

export type FolderAction =
  | { kind: FolderActionKind.Toggle; trail: number[] }
  | { kind: FolderActionKind.Set; trail: number[]; value: boolean }
  | {
      kind: FolderActionKind.UpdateTrail;
      oldTrail: number[];
      newTrail: number[];
    };

export enum FolderActionKind {
  Toggle,
  Set,
  UpdateTrail,
}

export function updateFoldersTrail(state: number[][], action: FolderAction) {
  let newState = [...state];
  switch (action.kind) {
    case FolderActionKind.Toggle:
      if (foldersIncludes(state, action.trail)) {
        newState = newState.filter(
          (f) => f.toString() != action.trail.toString(),
        );
      } else {
        newState.push(action.trail);
      }
      return newState;
    case FolderActionKind.UpdateTrail:
      return moveTrails(state, action.oldTrail, action.newTrail);
    case FolderActionKind.Set:
      if (!action.value) {
        newState = newState.filter(
          (f) => f.toString() != action.trail.toString(),
        );
      }
      if (!foldersIncludes(state, action.trail) && action.value) {
        newState.push(action.trail);
      }
      return newState;
  }
}

export function foldersIncludes(state: number[][], trail: number[]) {
  return state.some((f) => f.toString() == trail.toString());
}
