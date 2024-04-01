import { Db } from "@fb/createApp";
import { collection } from "firebase/firestore";

export const folders = collection(Db, "folders");
