import Folder, { SubitemKind } from "@/api/types/Folder";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import {
  faFolder,
  faMusic,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Grid = styled.div<{ subfolder?: boolean }>`
  display: grid;
  align-items: center;
  grid-template-rows: min-content auto;
  grid-template-columns: min-content auto;
  margin-left: 0.75rem;
  margin-top: 0.15rem;
  font-size: ${(props) => (props.subfolder ? "0.9em" : "1.2rem")};
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.625rem;
  padding: 0.25rem;
  border: solid 0.5px #ffffff;
  &:hover {
    background-color: #dddddd;
    border-color: #dddddd;
    border-radius: 4px;
  }
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

const RightIcons = styled.div`
  font-size: 1rem;
`;

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  rootId,
  disabledFolders,
  setDisabledFolders,
}: {
  folders: Folder[];
  rootId: string;
  disabledFolders: Set<string>;
  setDisabledFolders: (folders: Set<string>) => void;
}) {
  // NOTE: This uses the position from the element to the root
  // Hence, when swapping elements we must take to make sure
  // it matches up in these sets.
  const [openedFolders, setOpenedFolders] = useState<Set<string>>(
    () => new Set(),
  );
  const uniqueIDs = new Map<string, string>();
  const repeated = new Map<string, number>();

  function toggleOpenFolder(trail: string) {
    const newOpenedFolders = new Set(openedFolders);
    if (!openedFolders.has(trail)) {
      newOpenedFolders.add(trail);
    } else {
      newOpenedFolders.delete(trail);
    }

    setOpenedFolders(newOpenedFolders);
  }

  function toggleDisableFolder(trail: string) {
    const newDisabledFolders = new Set(disabledFolders);
    if (!disabledFolders.has(trail)) {
      newDisabledFolders.add(trail);
    } else {
      newDisabledFolders.delete(trail);
    }

    console.log(newDisabledFolders);

    setDisabledFolders(newDisabledFolders);
  }

  function generateIDs(trail: string, id: string): string {
    const value = uniqueIDs.get(trail);
    if (value) {
      return value;
    } else {
      let repeat = repeated.get(id);
      if (!repeat) {
        repeat = 0;
      }
      repeated.set(id, repeat + 1);
      return id + "-" + repeat;
    }
  }

  function drawFolder(folder: Folder, isSubFolder: boolean, trail: number[]) {
    return (
      <>
        <div>
          {folder.items.map((item, i) => {
            trail.push(i);
            const isPlaylist = item.kind == SubitemKind.SpotifyURI;

            const id = isPlaylist
              ? item.itemID
              : folders.filter((f) => f.id == item.itemID)[0].id;
            const uniqueID = generateIDs(trail.toString(), id);

            const name = isPlaylist
              ? item.itemID
              : folders.filter((f) => f.id == item.itemID)[0].name;
            const icon = isPlaylist ? faMusic : faFolder;

            const isSubfolderOpen =
              item.kind != SubitemKind.SpotifyURI &&
              openedFolders.has(trail.toString());
            const subitems =
              isSubfolderOpen &&
              drawFolder(
                folders.filter((f) => f.id == item.itemID)[0],
                true,
                trail,
              );

            const currItemTrail = [...trail];
            const onOpenClick = () => {
              if (!isPlaylist) toggleOpenFolder(currItemTrail.toString());
            };
            const onDisableClick = () => {
              toggleDisableFolder(currItemTrail.toString());
            };

            const isDisabled = disabledFolders.has(trail.toString());

            trail.pop();

            return (
              <div key={uniqueID}>
                <Grid
                  subfolder={isSubFolder}
                  css={css`
                    text-decoration: ${isDisabled ? "line-through" : "none"};
                  `}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    color="gray"
                    size={isSubFolder ? "lg" : "2x"}
                    onClick={onOpenClick}
                    css={css`
                      margin-bottom: 0.15rem;
                      cursor: pointer;
                    `}
                  />{" "}
                  <Label>
                    <div>{name}</div>
                    <RightIcons>
                      <FontAwesomeIcon
                        icon={faToggleOn}
                        onClick={onDisableClick}
                      />
                    </RightIcons>
                  </Label>
                  <BarHolder onClick={onOpenClick}>
                    <Bar />
                  </BarHolder>
                  <div>{subitems}</div>
                </Grid>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return drawFolder(
    folders.filter((folder) => folder.id == rootId)[0],
    false,
    [],
  );
}

export default FolderExporer;
