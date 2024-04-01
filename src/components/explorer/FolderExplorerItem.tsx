import styled from "@emotion/styled";
import FolderExplorerLabel from "./FolderExplorerLabel";
import { CSSProperties, useContext } from "react";
import Folder, { Subitem, SubitemKind } from "@/api/types/Folder";
import { DrawFolderList } from "./FolderExplorer";
import {
  FolderActionKind,
  FolderExplorerContext,
  foldersIncludes as foldersInclude,
} from "@/components/explorer/FolderContext";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getIcon } from "@/components/explorer/FolderUtils";
export const Grid = styled.div<{ depth: number }>`
  display: grid;
  align-items: center;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  margin-top: 0.5rem;
  font-size: ${(props) => Math.pow(0.95, props.depth - 1) * 1.2 + "rem"};
`;

const BarHolder = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
  &:hover div {
    border: solid 2px;
    border-color: black;
    border-top-width: 0px;
    border-bottom-width: 0px;
  }
`;

const Bar = styled.div`
  height: 100%;
  border: solid 1px;
  border-color: gray;
  border-top-width: 0px;
  border-bottom-width: 0px;
  border-radius: 10px;
`;

export default function FolderExplorerItem({
  trail,
  folders,
  setFolders,
  isParentDisabled,
  item,
  id,
  isDragOverlay = false,
}: {
  trail: number[];
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  isParentDisabled: boolean;
  item: Subitem;
  id: number | string;
  isDragOverlay?: boolean;
}) {
  const {
    disabledFolders,
    updateDisabledFolders,
    openedFolders,
    updateOpenedFolders,
  } = useContext(FolderExplorerContext);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0 : undefined,
    transition,
  };

  const isPlaylist = item.kind == SubitemKind.SpotifyURI;
  const isOpen =
    item.kind != SubitemKind.SpotifyURI && foldersInclude(openedFolders, trail);

  const icon = getIcon(item.kind, isOpen);

  const isLocallyDisabled = foldersInclude(disabledFolders, trail);
  const isDisabled = isParentDisabled || isLocallyDisabled;

  const subitems = isOpen && !isDragOverlay && (
    <DrawFolderList
      folders={folders}
      setFolders={setFolders}
      folderID={item.itemID}
      isParentDisabled={isDisabled}
      trail={trail}
    />
  );

  const onOpenClick = () => {
    if (!isPlaylist) {
      updateOpenedFolders({
        kind: FolderActionKind.Toggle,
        trail: trail,
      });
    }
  };
  const onDisableClick = () => {
    updateDisabledFolders({
      kind: FolderActionKind.Toggle,
      trail: trail,
    });
  };

  return (
    <Grid ref={setNodeRef} style={style} depth={trail.length}>
      <FolderExplorerLabel
        item={item}
        icon={icon}
        strikethrough={isDisabled}
        isDisabled={isLocallyDisabled}
        onDisableClick={onDisableClick}
        activatorListeners={listeners}
        activatorAttributes={attributes}
        isRootNode={trail.length == 1}
        onOpenClick={onOpenClick}
      />
      <BarHolder onClick={onOpenClick}>
        <Bar />
      </BarHolder>
      <div style={{ marginLeft: "0.75rem" }}>{subitems}</div>
    </Grid>
  );
}
