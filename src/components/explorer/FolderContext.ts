import { createContext } from "react";

export const FolderContext = createContext<{
  disabledFolders: number[][];
  setDisabledFolders: (disabled: number[][]) => void;
  openedFolders: number[][];
  setOpenedFolders: (opened: number[][]) => void;
}>({
  disabledFolders: [],
  setDisabledFolders: () => {},
  openedFolders: [],
  setOpenedFolders: () => {},
});
