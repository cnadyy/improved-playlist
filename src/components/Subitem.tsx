import { SubitemKind } from "@/api/types/Folder";
import { faFolder, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties } from "react";
import ItemName from "./ItemName";

const subItemStyles: CSSProperties = {
  listStyle: "none",
  display: "flex",
  gap: "10px",
  paddingLeft: "10px",
};

export default function Subitem({
  id,
  kind,
}: {
  id: string;
  kind: SubitemKind;
}): React.ReactNode {
  return (
    <>
      <li style={subItemStyles}>
        <FontAwesomeIcon
          icon={kind == SubitemKind.SpotifyURI ? faMusic : faFolder}
        />
        <ItemName id={id} kind={kind} />
      </li>
    </>
  );
}
