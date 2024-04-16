import { folderDoc } from "@/api/firebase/docs";
import Folder from "@/api/types/Folder";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export enum useFolderStatus {
    loading,
    failed,
    success,
}

export default function useFolder(
    id: FolderId,
): [Folder | undefined, useFolderStatus] {
    const [f, setFolder] = useState<Folder | undefined>();
    const [status, setStatus] = useState<useFolderStatus>(
        useFolderStatus.loading,
    );

    useEffect(() => {
        onSnapshot(
            folderDoc(id),
            (doc): void => {
                const folder = doc.data() as Folder;
                setFolder(folder);
                setStatus(useFolderStatus.success);
            },
            () => setStatus(useFolderStatus.failed),
        );
    }, [id]);

    return [f, status];
}
