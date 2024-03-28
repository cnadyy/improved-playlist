import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FolderExplorerLabel from "./FolderExplorerLabel";
import { useState } from "react";
import {
  faFolder,
  faFolderOpen,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import Folder, { Subitem, SubitemKind } from "@/api/types/Folder";
import { DrawFolderList } from "./FolderExplorer";

const Grid = styled.div<{ subfolder?: boolean }>`
  display: grid;
  align-items: center;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  margin-left: 0.75rem;
  margin-top: 0rem;
  font-size: ${(props) => (props.subfolder ? "0.95em" : "1.2rem")};
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
  folders,
  setFolders,
  isRoot,
  isParentDisabled,
  trail,
  item,
  // FIXME: use a context.
  disabled,
  setDisabled,
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  isRoot: boolean;
  isParentDisabled: boolean;
  trail: number[];
  item: Subitem;
  disabled: number[][];
  setDisabled: (disabled: number[][]) => void;
}) {
  const [open, setOpen] = useState(false);

  const isPlaylist = item.kind == SubitemKind.SpotifyURI;

  const isSubfolderOpen = item.kind != SubitemKind.SpotifyURI && open;

  const icon = isPlaylist ? faMusic : isSubfolderOpen ? faFolderOpen : faFolder;

  const isLocallyDisabled = disabled.some(
    (f) => f.toString() == trail.toString(),
  );
  const isDisabled = isParentDisabled || isLocallyDisabled;

  const subitems = isSubfolderOpen && (
    <DrawFolderList
      folders={folders}
      setFolders={setFolders}
      folder={folders.filter((f) => f.id == item.itemID)[0]}
      isRoot={false}
      isParentDisabled={isDisabled}
      trail={trail}
      disabled={disabled}
      setDisabled={setDisabled}
    />
  );

  const onOpenClick = () => {
    if (!isPlaylist) setOpen(!open);
  };
  const onDisableClick = () => {
    let newDisabled = [...disabled];
    if (newDisabled.some((f) => f.toString() == trail.toString())) {
      newDisabled = newDisabled.filter((f) => f.toString() != trail.toString());
    } else {
      newDisabled.push(trail);
    }
    setDisabled(newDisabled);
  };

  return (
    <Grid subfolder={!isRoot}>
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
        size={!isRoot ? "xl" : "2x"}
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
