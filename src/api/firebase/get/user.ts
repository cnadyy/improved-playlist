import { getDoc } from "firebase/firestore";
import { userDoc } from "@fb/docs";
import { useEffect, useState } from "react";

export async function getUser(id: UserId): Promise<User> {
    const user = await getDoc(userDoc(id));
    return user.data() as User;
}

export default function useUser(id: UserId): User | null {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        getUser(id).then((user) => {
            setUser(user);
        });
    }, [id]);

    return user;
}
