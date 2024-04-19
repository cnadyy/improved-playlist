import { and, or, orderBy, query, where } from "firebase/firestore";
import { folders } from "@/api/firebase/collections";
import { Auth } from "@/api/firebase/createApp";

// must be function as currentUser isn't defined until later
export const userFolders = () =>
    query(
        folders,
        where("owner", "==", Auth.currentUser!.uid),
        orderBy("name"),
    );

export const pinnedFolders = (ids: FolderId[]) =>
    query(
        folders,
        and(
            where("id", "in", ids),
            or(
                where("owner", "==", Auth.currentUser!.uid),
                where("public", "==", true),
            ),
        ),
        orderBy("name"),
    );
