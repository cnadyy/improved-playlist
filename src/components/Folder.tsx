import { CSSProperties } from "react";
import HideScrollBar from "@/css/HideScrollBar";

const folderIconStyle: CSSProperties = {
    width: "13rem",
    height: "13rem",
}

const folderStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "13rem",
}

const textStyle: CSSProperties = {
    maxHeight: "calc(6em + 1.2rem)",
    margin: "1.2rem 0 0",
    overflow: "scroll",
    ...HideScrollBar
}

export default function Folder({data}: {data: Folder}) {
    return <div style={folderStyle}>
        <div style={{backgroundColor: data.color, ...folderIconStyle}}/>
        <h2 style={textStyle}>{data.name}</h2>
        <p style={textStyle}>{data.playlists.join(" ")}</p>
    </div>
}
