import { CSSProperties, useEffect, useRef, useState } from "react";
import Folder from "@/api/types/Folder";
import "@css/folderIconStyle.css";
import "@css/floatingContents.css";
import Subitem from "./Subitem";
import { redirect } from "next/dist/server/api-utils";

const folderIconStyle: CSSProperties = {
  width: "100%",
  aspectRatio: "1/1",
  filter: "saturate(0.4)",
  transition: "0.5s",
};

const folderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "13rem",
  height: "100%",
  minWidth: "200px",
};

const textStyle: CSSProperties = {
  margin: "1rem 0 0",
  overflow: "hidden",
  fontSize: "1.3rem",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
};

const rightToolTip: CSSProperties = {
  backgroundColor: "red",
}

const leftToolTip: CSSProperties = {
  backgroundColor: "green",
}

function FolderComponent({ data }: { data: Folder }) {
  const folderRef = useRef<null | HTMLDivElement>(null);
  const clientWidth = document.documentElement.clientWidth;
  const [posRight, setPostRight] = useState(0);

  useEffect(() => {
    if (folderRef.current) {
      const rightMeasure = folderRef.current.getBoundingClientRect().right;
      if (rightMeasure != posRight) setPostRight(rightMeasure);
    }
  });

  const useRightTooltip = (clientWidth - (190) > posRight);

  return (
    <div style={folderStyle} className={"folderComponent"} ref={folderRef}>
      <div
        className={"folderIcon"}
        style={{ backgroundColor: data.color, ...folderIconStyle }}
      />
      <h2 style={textStyle}>{data.name}</h2>
      <ul style={useRightTooltip ? rightToolTip : leftToolTip} className={"contentsList"}>
        {data.items.map((i) => (
          <Subitem id={i.itemID} kind={i.kind} key={i.itemID} />
        ))}
      </ul>
    </div>
  );
}

export { FolderComponent as default, folderStyle, folderIconStyle };
