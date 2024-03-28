import { SubitemKind } from "@/api/types/Folder";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemName from "@/components/ItemName";
import {
  faBars,
  faBookmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.625rem;
  padding: 0.25rem;
  border-radius: 4px;
  &:hover {
    background-color: #dddddd;
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
  onDisableClick,
}: {
  item: { kind: SubitemKind; itemID: string };
  strikethrough: boolean;
  isDisabled: boolean;
  onDisableClick: () => void;
}) {
  return (
    <Label>
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
          data-movable-handle
          style={{
            marginRight: "1.25em",
          }}
          icon={faBars}
        />
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
    // </Draggable>
  );
}
