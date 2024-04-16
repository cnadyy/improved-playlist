import { getDoc, getDocFromCache, onSnapshot } from "firebase/firestore";
import { userDoc } from "@fb/docs";
import { useEffect, useState } from "react";

export async function getUser(id: UserId): Promise<User> {
    try {
        const user = await getDocFromCache(userDoc(id));
        return user.data() as User;
    } catch {
        const user = await getDoc(userDoc(id));
        return user.data() as User;
    }
}

export default function useUser(id: UserId): User | null {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onSnapshot(userDoc(id), (doc) => {
            const data = doc.data();
            if (data) {
                setUser(data as User);
            }
        });
    }, [id]);

    return user;
}
