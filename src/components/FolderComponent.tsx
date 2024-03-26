import { CSSProperties, useEffect, useRef, useState } from "react";
import Folder from "@/api/types/Folder";
import "@css/folderIconStyle.css";
import "@css/floatingContents.css";
import ItemName from "./Subitem";
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
  position: "relative",
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
  position: "absolute",
  left: "105%",
  top: "5%",
}

const leftToolTip: CSSProperties = {
  position: "absolute",
  right: "105%",
  top: "5%",
}

function FolderComponent({ data }: { data: Folder }) {
  const folderRef = useRef<null | HTMLDivElement>(null);
  const clientWidth = document.documentElement.clientWidth;
  const [posRight, setPostRight] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (folderRef.current) {
      const rightMeasure = folderRef.current.getBoundingClientRect().right;
      if (rightMeasure != posRight) setPostRight(rightMeasure);
    }
  }, [isHovering]);

  const useRightTooltip = (clientWidth - (330) > posRight);

  return (
    <div style={folderStyle} className={"folderComponent"} ref={folderRef} onMouseOver={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <div
        className={"folderIcon"}
        style={{ backgroundColor: data.color, ...folderIconStyle }}
      />
      <h2 style={textStyle}>{data.name}</h2>
      <div style={useRightTooltip ? rightToolTip : leftToolTip} className={"contentsList"}>
        <h4>{data.name}</h4>
        <p>Item count: {data.items.length}</p>
        <ul style={{padding: "0"}}>
          {data.items.map((i) => (
            <ItemName id={i.itemID} kind={i.kind} key={i.itemID} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export { FolderComponent as default, folderStyle, folderIconStyle };
