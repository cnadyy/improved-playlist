"use client";

import useFolder, { useFolderStatus } from "@/api/hooks/useFolder";
import Folder, { Subitem, SubitemKind } from "@/api/types/Folder";
import useParamId from "@/components/player-list/useId";
import React, { createContext } from "react";

type PositionId = string;

const openedFolders = createContext<PositionId[]>([]);
const disabledFolders = createContext<PositionId[]>([]);

function RootFolderInformation({ folder }: { folder: Folder }) {
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

export default function Page() {
    const id = useParamId() as FolderId;
    const [rootFolder, status] = useFolder(id);

    if (status == useFolderStatus.failed)
        return (
            <p>
                Unable to load folder! Possibly unable to access or it does not
                exist
            </p>
        );

    return (
        <>
            {rootFolder ? (
                <RootFolderInformation folder={rootFolder} />
            ) : (
                <p>Loading folder info.....</p>
            )}
            {rootFolder ? (
                <ItemList folder={rootFolder} />
            ) : (
                <p>Loading item list.....</p>
            )}
        </>
    );
}

function ItemList({ folder }: { folder: Folder }): React.ReactNode {
    return (
        <ol
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                paddingLeft: "2rem",
                backgroundColor: "#" + Math.floor(Math.random()*16777215).toString(16),
            }}
        >
            <ul style={{ backgroundColor: "red" }}>
                This is the top of a given list
            </ul>
            {folder.items.map((i) => (
                <Item key={crypto.randomUUID()} item={i} />
            ))}
        </ol>
    );
}

function Item({ item }: { item: Subitem }): React.ReactNode {
    if (item.kind == SubitemKind.SpotifyURI)
        return <SongItem URI={item.itemID} />;
    else if (item.kind == SubitemKind.Folder)
        return <FolderItem id={item.itemID} />;
}

function FolderItem({ id }: { id: FolderId }): React.ReactNode {
    const [folder, status] = useFolder(id);

    return (
        <>
            {folder ? (
                <ul>
                    <p>
                        {folder.name}, {folder.id}, {folder.color}
                    </p>
                    <ItemList folder={folder} />
                </ul>
            ) : status == useFolderStatus.failed ? null : (
                <p>loading.....</p>
            )}
        </>
    );
}

function SongItem({ URI }: { URI: SpotifyURI }) {
    return (
        <>
            <ul>this is a playlist. heres the uri: {URI}</ul>
        </>
    );
}
