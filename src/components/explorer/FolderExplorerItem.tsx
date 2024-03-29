import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FolderExplorerLabel from "./FolderExplorerLabel";
import { useContext } from "react";
import {
  faFolder,
  faFolderOpen,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import Folder, { Subitem, SubitemKind } from "@/api/types/Folder";
import { DrawFolderList } from "./FolderExplorer";
import {
  FolderActionKind,
  FolderExplorerContext,
  foldersIncludes as foldersInclude,
} from "./FolderContext";
import { folderIconStyle } from "../FolderComponent";

const Grid = styled.div<{ depth: number }>`
  display: grid;
  align-items: center;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  margin-left: 0.75rem;
  margin-top: 0rem;
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
}: {
  trail: number[];
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  isParentDisabled: boolean;
  item: Subitem;
}) {
  const {
    disabledFolders,
    updateDisabledFolders,
    openedFolders,
    updateOpenedFolders,
  } = useContext(FolderExplorerContext);

  const isPlaylist = item.kind == SubitemKind.SpotifyURI;
  const isOpen =
    item.kind != SubitemKind.SpotifyURI && foldersInclude(openedFolders, trail);

  const icon = isPlaylist ? faMusic : isOpen ? faFolderOpen : faFolder;

  const isLocallyDisabled = foldersInclude(disabledFolders, trail);
  const isDisabled = isParentDisabled || isLocallyDisabled;

  const subitems = isOpen && (
    <DrawFolderList
      folders={folders}
      setFolders={setFolders}
      folder={folders.filter((f) => f.id == item.itemID)[0]}
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
    <Grid depth={trail.length}>
      <div></div>
      <div
        css={css`
          height: 0.5rem;
          border-radius: 4px;
          width: 100%;
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={css`
            height: 4px;
            border-radius: 4px;
            width: 100%;
            margin-left: 1rem;
          `}
        ></div>
      </div>
      <FontAwesomeIcon
        role="button"
        icon={icon}
        color="gray"
        size={trail.length != 1 ? "xl" : "2x"}
        onClick={onOpenClick}
        css={css`
          margin-bottom: 0.15rem;
          cursor: pointer;
        `}
      />{" "}
      <div>
        <FolderExplorerLabel
          item={item}
          strikethrough={isDisabled}
          isDisabled={isLocallyDisabled}
          onDisableClick={onDisableClick}
        />
      </div>
      <BarHolder onClick={onOpenClick}>
        <Bar />
      </BarHolder>
      <div>{subitems}</div>
    </Grid>
  );
}
