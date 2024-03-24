import getFolder from "@/api/getFolder";
import getPlaylist from "@/api/getPlaylist";
import { SubitemKind } from "@/api/types/Folder";
import { faFolder, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { CSSProperties, useEffect, useState } from "react";

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
  const [itemName, setItemName] = useState<null | string>(null);

  useEffect(() => {
    console.log(id);
    if (kind == SubitemKind.SpotifyURI)
      getPlaylist(id).then((obj) => setItemName(obj.name));
    else getFolder(id).then((obj) => setItemName(obj.name));
  }, [id, kind]);

  return (
    <>
      {itemName ? (
        <li style={subItemStyles}>
          <FontAwesomeIcon icon={(kind == SubitemKind.SpotifyURI) ? faMusic : faFolder}/>{itemName}
        </li>
      ) : null}
    </>
  );
}
