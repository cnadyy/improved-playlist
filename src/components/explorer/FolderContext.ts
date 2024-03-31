import moveTrails from "@/utils";
import { createContext } from "react";
import { act } from "react-dom/test-utils";

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
  } else if (action.kind == FolderActionKind.UpdateTrail) {
    return moveTrails(state, action.oldTrail, action.newTrail);
  } else {
    let newState = [...state];
    if (!action.value) {
      newState = newState.filter(
        (f) => f.toString() != action.trail.toString(),
      );
    }
    if (
      !state.some((f) => f.toString() == action.trail.toString()) &&
      action.value
    ) {
      newState.push(action.trail);
    }
    return newState;
  }
}

export function foldersIncludes(state: number[][], trail: number[]) {
  return state.some((f) => f.toString() == trail.toString());
}
