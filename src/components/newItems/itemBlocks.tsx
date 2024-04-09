import Folder from "@/api/types/Folder";
import lineClamp from "@/css/LineClamp";
import React from "react";
import { Selected } from "./AddItem";
import { SelectedItems } from "./UpdateSelectedItems";

export const FolderBlock: (
    f: Folder,
    selectedItems: SelectedItems,
    sOnClick: (id: FolderId) => void,
) => React.ReactElement = (f, selectedItems, sOnClick) => (
    <div
        style={{ minWidth: "8rem", maxWidth: "8rem", position: "relative" }}
        key={f.id}
        onClick={() => sOnClick(f.id)}
    >
        <div
            style={{
                width: "8rem",
                aspectRatio: "1/1",
                backgroundColor: f.color,
            }}
        />
        <p style={lineClamp}>{f.name}</p>
        {selectedItems.folders?.includes(f.id) ? <Selected /> : null}
    </div>
);

export const PlaylistBlock: (
    p: Playlist,
    selectedItems: SelectedItems,
    sOnClick: (id: PlaylistId) => void,
) => React.ReactNode = (p, selectedItems, sOnClick) => (
    <div
        style={{ minWidth: "8rem", maxWidth: "8rem", position: "relative" }}
        key={p.id}
        onClick={() => sOnClick(p.id)}
    >
        {p.images != undefined && p.images.length != 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" src={p.images[0]?.url} style={{ width: "8rem" }} />
        ) : (
            <div
                style={{
                    backgroundColor: "grey",
                    width: "8rem",
                    height: "8rem",
                }}
            />
        )}
        <p style={lineClamp}>{p.name}</p>
        {selectedItems.playlists?.includes(p.id) ? <Selected /> : null}
    </div>
);
