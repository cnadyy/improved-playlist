"use client";
import React, { useEffect } from "react";
import { Item } from "./Item";
import { useChildPlayer } from "@/app/playback-test/usePlayer";
import Folder from "@/api/types/Folder";

/**
 * @param folder is folder that has already succeeeded in being fetched with useFolder()
 * @returns Ordered list of items resolved from the items field of the given folder
 */
export default function ItemList({
    folder,
    hide,
    disabled,
    playEvent,
}: {
    folder: Folder;
    hide?: boolean;
    disabled?: boolean;
    playEvent: PlayEvent;
}): React.ReactNode {
    const playableItems = useChildPlayer(folder.items, playEvent);

    return (
        <ol
            style={{
                display: "flex",
                flexDirection: "column",
                ...(hide ? { display: "none" } : {}),
            }}
        >
            {playableItems.map((item, index) => {
                // the key need only be unique within its own list, and as items are
                // in a user determined order the index is a safe identifier
                return (
                    <Item
                        disabled={Boolean(disabled)}
                        playEvent={item.playEvent}
                        key={index}
                        item={item}
                    />
                );
            })}
        </ol>
    );
}
