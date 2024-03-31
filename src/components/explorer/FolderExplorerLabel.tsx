import { SubitemKind } from "@/api/types/Folder";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemName from "@/components/ItemName";
import {
  faBars,
  faBookmark,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import {
  SyntheticListenerMap,
} from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";

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
  strikethrough,
  isDisabled,
  onDisableClick,
  activatorListeners,
  activatorAttributes,
}: {
  item: { kind: SubitemKind; itemID: string };
  strikethrough: boolean;
  isDisabled: boolean;
  onDisableClick: () => void;
  activatorListeners: SyntheticListenerMap | undefined;
  activatorAttributes: DraggableAttributes;
}) {
  return (
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
  );
}
