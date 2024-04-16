"use client";
import Folder from "@/api/types/Folder";
import React from "react";
import { Item } from "./Item";
import { PositionId } from "@/api/types/itemsReducer";

/**
 * @param folder is folder that has already succeeeded in being fetched with useFolder()
 * @returns Ordered list of items resolved from the items field of the given folder
 */
export default function ItemList({
    folder,
}: {
    folder: Folder;
}): React.ReactNode {
    return (
        <ol
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {folder.items.map((i) => {
                // every item has a unique position id for the lifetime of the element used to uniquely identify it in the tree
                const positionId = crypto.randomUUID() as PositionId;
                return (
                    <Item positionId={positionId} key={positionId} item={i} />
                );
            })}
        </ol>
    );
}
