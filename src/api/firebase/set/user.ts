import { setDoc } from "firebase/firestore";
import { userDoc } from "@fb/docs";

export default async function setUser(user: User): Promise<void> {
    await setDoc(userDoc(user.uuid), user);
}
