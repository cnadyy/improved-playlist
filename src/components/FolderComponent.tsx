import { CSSProperties, useEffect } from "react";
import HideScrollBar from "@css/HideScrollBar";
import Folder, { SubitemKind } from "@/api/types/Folder";
import "@css/folderIconStyle.css";
import Subitem from "./Subitem";

const folderIconStyle: CSSProperties = {
  width: "13rem",
  height: "13rem",
  filter: "saturate(0.4)",
  transition: "0.5s",
};

const folderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: "13rem",
};

const textStyle: CSSProperties = {
  maxHeight: "calc(6em + 1.2rem)",
  margin: "1.2rem 0 0",
  overflow: "scroll",
  ...HideScrollBar,
};

export default function FolderComponent({ data }: { data: Folder }) {
  return (
    <div style={folderStyle}>
      <div
        className={"folderIcon"}
        style={{ backgroundColor: data.color, ...folderIconStyle }}
      />
      <h2 style={textStyle}>{data.name}</h2>
      <p style={textStyle}>
        ID of folder: {data.id}
      </p>
      <ul>
        {data.items.map(i => <Subitem id={i.itemID} kind={i.kind} key={i.itemID}/>)}
      </ul>
    </div>
  );
}
