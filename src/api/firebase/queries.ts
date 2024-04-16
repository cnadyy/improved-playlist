import { or, orderBy, query, where } from "firebase/firestore";
import { folders } from "@/api/firebase/collections";
import { Auth } from "@/api/firebase/createApp";

// must be function as currentUser isn't defined until later
export const userFolders = () =>
    query(
        folders,
        or(
            where("owner", "==", Auth.currentUser!.uid),
            where("public", "==", true),
        ),
        orderBy("name"),
    );
