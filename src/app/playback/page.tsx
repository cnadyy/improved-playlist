"use client";

import FolderDetailsComponent from "@/components/FolderDetails";
import { useSearchParams } from "next/navigation";
import FolderExplorer from "@/components/explorer/FolderExplorer";
import { css } from "@emotion/react";
import { useMemo, useReducer } from "react";
import Header from "@/components/Header";
import {
    FolderExplorerContext,
    Trail,
    updateFoldersTrail,
} from "@/components/explorer/FolderContext";
import useUserFolders from "@/api/hooks/useUserFolders";
import Folder from "@/api/types/Folder";

export default function Page() {
    const searchParams = useSearchParams();
    const [folders, setFolder] = useUserFolders();
    const folderID = searchParams.get("id");
    const folder = folders.find((folder) => folder.id == folderID);

    if (!folder || !folderID) {
        return <div>This folder does not exist</div>;
    }

    return (
        <>
            <Header />
            <main style={{ margin: "2rem 0" }}>
                <FolderExplorerPage
                    folders={folders}
                    setFolder={setFolder}
                    folder={folder}
                    folderID={folderID}
                    key={folderID}
                />
            </main>
        </>
    );
}

function FolderExplorerPage({
    folders,
    setFolder,
    folder,
    folderID,
}: {
    folders: Folder[];
    setFolder: (folder: Folder) => void;
    folder: Folder;
    folderID: string;
}) {
    const [disabledFolders, updateDisabledFolders] = useReducer(
        updateFoldersTrail,
        [],
    );
    const [openedFolders, updateOpenedFolders] = useReducer(
        updateFoldersTrail,
        [],
    );
    // NOTE: This is definately not the intended purpose of useMemo,
    // but it still works for this use case it seems.
    const trails = useMemo<Trail[]>(() => {
        return [];
    }, []);

    return (
        <FolderExplorerContext.Provider
            value={{
                disabledFolders,
                updateDisabledFolders,
                openedFolders,
                updateOpenedFolders,
                setFolder,
                trails,
            }}
        >
            <div
                css={css`
                    margin: 0 2rem;
                `}
            >
                <FolderDetailsComponent folder={folder} folders={folders} />
            </div>
            <div
                css={css`
                    margin: 2rem;
                `}
            >
                <FolderExplorer folders={folders} rootId={folderID} />
            </div>
        </FolderExplorerContext.Provider>
    );
}
