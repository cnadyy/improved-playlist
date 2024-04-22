"use client";

import React, { useEffect, useState } from "react";
import ItemList from "./ItemList";
import useFolder, { useFolderStatus } from "@/api/hooks/useFolder";
import { useIsDisabled, useIsOpen } from "./hooks";
import { PositionId } from "@/api/types/itemsReducer";
import { useFolderLoader, usePlayback } from "./usePlayback";
import { Subitem, SubitemKind } from "@/api/types/Folder";

export function Item({
    item,
    disabled,
    playEvent,
}: {
    item: Subitem;
    disabled: boolean;
    playEvent: PlayEvent;
}): React.ReactNode {
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
        <PlaylistAsItem
            parentDisabled={disabled}
            positionId={posId}
            playEvent={playEvent}
            URI={item.itemID}
        />
    ) : (
        <FolderAsItem
            parentDisabled={disabled}
            positionId={posId}
            playEvent={playEvent}
            id={item.itemID}
        />
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
    parentDisabled,
    playEvent,
}: {
    URI: SpotifyURI;
    positionId: PositionId;
    parentDisabled: boolean;
    playEvent: PlayEvent;
}) {
    const [locallyDisabled, toggleDisabled] = useIsDisabled(positionId);
    const disabled = Boolean(locallyDisabled) || parentDisabled;

    usePlayback(URI, playEvent, disabled);

    return (
        <li>
            <div
                style={{ backgroundColor: "#f4c8b3" }}
                onClick={toggleDisabled}
            >
                <p
                    style={
                        parentDisabled ? { textDecoration: "line-through" } : {}
                    }
                >
                    this is a playlist. heres the uri: {URI}
                </p>
                {disabled ? "im disabled" : "im not"}
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
    playEvent,
}: {
    id: FolderId;
    parentDisabled?: boolean;
    positionId: PositionId;
    playEvent: PlayEvent;
}): React.ReactNode {
    const [folder, status] = useFolder(id);
    const [locallyDisabled, toggleDisabled] = useIsDisabled(positionId);
    const [open, toggleOpen] = useIsOpen();
    useFolderLoader(playEvent, () => toggleOpen(true));

    const disabled = locallyDisabled || parentDisabled;

    useEffect(() => {
        if (status == useFolderStatus.failed) {
            // instantly resolve playback on failure
            playEvent.then((resolve) => resolve());
        }
    }, [status, playEvent]);

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
                    onClick={() => toggleOpen()}
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
                {open.loaded ? (
                    open.open ? (
                        <ItemList
                            disabled={Boolean(disabled)}
                            folder={folder}
                            playEvent={playEvent}
                        />
                    ) : (
                        <ItemList
                            hide
                            disabled={Boolean(disabled)}
                            folder={folder}
                            playEvent={playEvent}
                        />
                    )
                ) : null}
            </li>
        );
}
