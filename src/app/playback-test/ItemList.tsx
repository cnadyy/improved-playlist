"use client";
import Folder from "@/api/types/Folder";
import React from "react";
import { Item } from "./Item";

/**
 * @param folder is folder that has already succeeeded in being fetched with useFolder()
 * @returns Ordered list of items resolved from the items field of the given folder
 */
export default function ItemList({
    folder,
    hide,
    disabled,
}: {
    folder: Folder;
    hide?: boolean;
    disabled?: boolean;
}): React.ReactNode {
    return (
        <ol
            style={{
                display: "flex",
                flexDirection: "column",
                ...(hide ? { display: "none" } : {}),
            }}
        >
            {folder.items.map((item, index) => {
                // the key need only be unique within its own list, and as items are
                // in a user determined order the index is a safe identifier
                return (
                    <Item
                        disabled={Boolean(disabled)}
                        key={index}
                        item={item}
                    />
                );
            })}
        </ol>
    );
}
