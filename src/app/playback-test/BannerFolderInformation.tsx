"use client";
import Folder from "@/api/types/Folder";
import React from "react";

export default function BannerFolderInformation({
    folder,
}: {
    folder: Folder;
}): React.ReactNode {
    return (
        <div
            style={{
                backgroundColor: folder.color,
                display: "flex",
                height: "10rem",
                justifyContent: "space-around",
            }}
        >
            <p>{folder.name}</p>
            <p>{folder.color}</p>
        </div>
    );
}
