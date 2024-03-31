import { SubitemKind } from "@/api/types/Folder";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemName from "@/components/ItemName";
import {
  faBars,
  faBookmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { css } from "@emotion/react";

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
  cursor: pointer;
  user-select: none;
`;

const RightIcons = styled.div`
  font-size: 1rem;
  display: none;
`;

const RightIcon = styled(FontAwesomeIcon)`
  margin: 0 0.5rem;
`;

const LabelText = styled.a<{ strikethrough?: boolean }>`
  text-decoration: ${(props) =>
    props.strikethrough ? "line-through" : "none"};
`;

export default function FolderExplorerLabel({
  item,
  isRootNode,
  icon,
  strikethrough,
  isDisabled,
  onOpenClick = () => {},
  onDisableClick = () => {},
  activatorListeners,
  activatorAttributes,
}: {
  item: { kind: SubitemKind; itemID: string };
  isRootNode: boolean;
  icon: IconProp;
  strikethrough: boolean;
  isDisabled: boolean;
  onOpenClick?: () => void;
  onDisableClick?: () => void;
  activatorListeners?: SyntheticListenerMap;
  activatorAttributes?: DraggableAttributes;
}) {
  return (
    <>
      <FontAwesomeIcon
        role="button"
        icon={icon}
        color="gray"
        size={isRootNode ? "2xl" : "xl"}
        onClick={onOpenClick}
        css={css`
          margin-bottom: 0.15rem;
          cursor: pointer;
        `}
      />{" "}
      <Label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LabelText strikethrough={strikethrough}>
            <ItemName id={item.itemID} kind={item.kind} />
          </LabelText>
          <DisableButton
            className="labelHover"
            role="button"
            onClick={onDisableClick}
          >
            Click to {isDisabled ? "enable" : "disable"}
          </DisableButton>
        </div>

        <RightIcons className="labelHover">
          <RightIcon
            {...activatorAttributes}
            {...activatorListeners}
            icon={faBars}
          />
          <RightIcon icon={faBookmark} />
          <RightIcon icon={faEllipsis} />
        </RightIcons>
      </Label>
    </>
  );
}
