/**
 * Prvoides firebase document refs
 */
import { Db } from "@fb/createApp";
import { doc } from "firebase/firestore";

export const folderDoc = (id: FolderId) => doc(Db, "folders", id);
