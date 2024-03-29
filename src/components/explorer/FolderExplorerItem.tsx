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
import { FolderActionKind, FolderContext } from "./FolderContext";

const Grid = styled.div<{ subfolder?: boolean }>`
  display: grid;
  align-items: center;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  margin-left: 0.75rem;
  margin-top: 0rem;
  font-size: ${(props) => (props.subfolder ? "1.1rem" : "1.2rem")};
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
  isRoot,
  isParentDisabled,
  item,
  // FIXME: use a context.
}: {
  trail: number[];
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  isRoot: boolean;
  isParentDisabled: boolean;
  item: Subitem;
}) {
  const {
    disabledFolders,
    updateDisabledFolders,
    openedFolders,
    updateOpenedFolders,
  } = useContext(FolderContext);

  const isPlaylist = item.kind == SubitemKind.SpotifyURI;
  const isSubfolderOpen =
    item.kind != SubitemKind.SpotifyURI &&
    openedFolders.some((f) => f.toString() == trail.toString());
  const icon = isPlaylist ? faMusic : isSubfolderOpen ? faFolderOpen : faFolder;

  const isLocallyDisabled = disabledFolders.some(
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
