"use client";

import { Subitem, SubitemKind } from "@/api/types/Folder";
import React, { useEffect, useState } from "react";
import ItemList from "./ItemList";
import useFolder, { useFolderStatus } from "@/api/hooks/useFolder";
import { useIsDisabled, useIsOpen } from "./hooks";
import { PositionId } from "@/api/types/itemsReducer";

export function Item({ item }: { item: Subitem }): React.ReactNode {
    const [posId, setPosId] = useState<PositionId | undefined>();

    // create positionID that lives for lifetime of component
    useEffect(() => setPosId(crypto.randomUUID()), []);

    if (typeof posId == "undefined")
        return (
            <li>
                <p>loading....</p>
            </li>
        );

    return item.kind == SubitemKind.SpotifyURI ? (
        <PlaylistAsItem positionId={posId} URI={item.itemID} />
    ) : (
        <FolderAsItem positionId={posId} id={item.itemID} />
    );
}

/**
 * @param URI for respctive playlist
 * @returns <li> for use under ItemList
 * @note Data fetching is performed in function
 */
export function PlaylistAsItem({
    URI,
    positionId,
}: {
    URI: SpotifyURI;
    positionId: PositionId;
}) {
    return (
        <li>
            <div style={{ backgroundColor: "#f4c8b3" }}>
                <p>this is a playlist. heres the uri: {URI}</p>
            </div>
        </li>
    );
}

/**
 * @param id for respective folder
 * @returns <li> for use under ItemList
 * @note Data fetching is performed in function
 */
export function FolderAsItem({
    id,
    parentDisabled,
    positionId,
}: {
    id: FolderId;
    parentDisabled?: boolean;
    positionId: PositionId;
}): React.ReactNode {
    const [folder, status] = useFolder(id);
    const [disabled, toggleDisabled] = useIsDisabled(positionId);
    const [open, toggleOpen] = useIsOpen(positionId);

    if (status == useFolderStatus.failed) return null;

    if (status == useFolderStatus.loading)
        return (
            <li>
                <p>loading.....</p>
            </li>
        );

    if (folder)
        return (
            <li>
                {/* Should display the info for this specifc folder*/}
                <div
                    style={{ backgroundColor: "#786990", display: "flex" }}
                    onClick={toggleOpen}
                >
                    <p
                        style={
                            disabled ? { textDecoration: "line-through" } : {}
                        }
                    >
                        {folder.name}, {folder.id}, {folder.color}
                    </p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDisabled();
                        }}
                    >
                        {disabled ? "Enable" : "Disable"} me!
                    </button>
                </div>
                {/* Display its items */}
                {open ? <ItemList folder={folder} /> : null}
            </li>
        );
}
