import { SubitemKind } from "@/api/types/Folder";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemName from "@/components/ItemName";
import { faBookmark, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.625rem;
  padding: 0.25rem;
  border-radius: 4px;
  border: solid 1.5px #ffffff;
  &:hover {
    background-color: #dddddd;
    border-color: #dddddd;
  }
  &:hover .labelHover {
    display: block;
  }
`;

const DisableButton = styled.div`
  font-size: 0.75rem;
  font-weight: 300;
  margin-left: 1rem;
  display: none;
`;

const RightIcons = styled.div`
  font-size: 1rem;
  display: none;
`;

export default function FolderExplorerLabel({
  item,
  strikethrough,
  isDisabled,
  isPlaylist,
  onDisableClick,
}: {
  item: { kind: SubitemKind; itemID: string };
  strikethrough: boolean;
  isDisabled: boolean;
  isPlaylist: boolean;
  onDisableClick: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [isDragging, setDragging] = useState(false);

  return (
    <Label
      draggable={true}
      onDragOver={() => setDragOver(true)}
      onDragLeave={() => setDragOver(false)}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      style={{
        borderColor: dragOver && !isPlaylist && !isDragging ? "#ebbab9" : "#ffffff",
        opacity: isDragging && !dragOver ? 0.5 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <a
          css={css`
            text-decoration: ${strikethrough ? "line-through" : "none"};
          `}
        >
          <ItemName id={item.itemID} kind={item.kind} />
        </a>
        <DisableButton
          className="labelHover"
          css={css`
            cursor: pointer;
            user-select: none;
          `}
          onClick={onDisableClick}
        >
          Click to {isDisabled ? "enable" : "disable"}
        </DisableButton>
      </div>

      <RightIcons className="labelHover">
        <FontAwesomeIcon
          css={css`
            margin: 0 0.5rem;
          `}
          icon={faBookmark}
        />
        <FontAwesomeIcon
          css={css`
            margin: 0 0.5rem;
          `}
          icon={faEllipsis}
        />
      </RightIcons>
    </Label>
  );
}
