import moveTrails from "@/utils";
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
  | {
      kind: FolderActionKind.UpdateTrail;
      oldTrail: number[];
      newTrail: number[];
    };

export enum FolderActionKind {
  Toggle,
  UpdateTrail,
}

export function updateFoldersTrail(state: number[][], action: FolderAction) {
  if (action.kind == FolderActionKind.Toggle) {
    let newState = [...state];
    if (state.some((f) => f.toString() == action.trail.toString())) {
      newState = newState.filter(
        (f) => f.toString() != action.trail.toString(),
      );
    } else {
      newState.push(action.trail);
    }
    return newState;
  } else {
    return moveTrails(state, action.oldTrail, action.newTrail);
  }
}

export function foldersIncludes(state: number[][], trail: number[]) {
  return state.some((f) => f.toString() == trail.toString());
}
