import getUserPinnedFolders from "@/api/firebase/get/userPinnedFolders";
import Folder from "@/api/types/Folder";
import { useEffect, useState } from "react";

/**
 * @info gets the folders at the time of mount
 */
export default function usePinnedUserFolders(): Folder[] {
    const [pinned, setPinned] = useState<Folder[]>([]);

    useEffect(() => {
        getUserPinnedFolders().then(setPinned);
    }, []);

    return pinned;
}
