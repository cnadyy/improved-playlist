import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FolderExplorerLabel from "./FolderExplorerLabel";
import { useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";

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
  isRoot,
  onOpenClick,
  isDisabled,
  isLocallyDisabled,
  isPlaylist,
  onDisableClick,
  item,
  icon,
  subitems,
}: any) {
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
      {/**
        <div
        css={css`
          display: flex;
          align-items: center;
          `}
          >
      */}
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
      {/**
      </div>
      */}
      <div>
        <FolderExplorerLabel
          item={item}
          strikethrough={isDisabled}
          isDisabled={isLocallyDisabled}
          onDisableClick={onDisableClick}
          isPlaylist={isPlaylist}
        />
      </div>
      <BarHolder onClick={onOpenClick}>
        <Bar />
      </BarHolder>
      <div>{subitems}</div>
    </Grid>
  );
}
