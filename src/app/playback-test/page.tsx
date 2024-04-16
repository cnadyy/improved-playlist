"use client";

import useFolder, { useFolderStatus } from "@/api/hooks/useFolder";
import useParamId from "@/api/hooks/useId";
import React from "react";
import BannerFolderInformation from "./BannerFolderInformation";
import ItemList from "./ItemList";
import ListStateContext from "./ListStateContext";

export default function Page(): React.ReactNode {
    const id = useParamId() as FolderId;
    const [rootFolder, status] = useFolder(id);

    switch (status) {
        case useFolderStatus.failed:
            return (
                <p>
                    Unable to load folder! Possibly unable to access or it does
                    not exist
                </p>
            );
        case useFolderStatus.loading:
            return (
                <>
                    <p>Loading folder info....</p>
                    <p>Loading folder list....</p>
                </>
            );
        case useFolderStatus.success:
            return (
                <ListStateContext>
                    <BannerFolderInformation folder={rootFolder!} />
                    <ItemList folder={rootFolder!} />
                </ListStateContext>
            );
    }
}
