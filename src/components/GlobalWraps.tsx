import React, { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Unauthenticated from "@/app/@unauthenticated/default";
import { isAuthenticated } from "@/api/util";
import PlayerInfo from "@/components/player/PlayerInfo";
import Loading from "./Loading";
import { getUser } from "@/api/firebase/get/user";
import { Auth } from "@/api/firebase/createApp";
import setUser from "@/api/firebase/set/user";

export default function GlobalWraps({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const pathname = usePathname();

    // non guarded pages
    const exception = ["/redirect", "/", "/redirectFirebase"].filter(
        (s) => s == pathname,
    ).length;

    // check if authenticated
    const { isLoading, data: authBool } = useQuery({
        queryKey: ["login"],
        queryFn: async () => {
            return await isAuthenticated();
        },
    });

    useEffect(() => {
        if (authBool) {
            getUser(Auth.currentUser!.uid).then((user) => {
                // FIXME: proper username creation
                if (!user) {
                    setUser({
                        uuid: Auth.currentUser!.uid,
                        name: "Hi!",
                        pinned: [],
                    });
                }
            })
        }
    }, [authBool]);

    if (isLoading && !exception) {
        return <Loading />;
    }

    return (
        <>
            {authBool || exception ? children : <Unauthenticated />}
            {authBool && !exception && (
                <>
                    <div style={{ marginBottom: "6rem" }}></div>
                    <script
                        src="https://sdk.scdn.co/spotify-player.js"
                        async
                    ></script>
                    <PlayerInfo />
                </>
            )}
            <ReactQueryDevtools
                buttonPosition="top-left"
                initialIsOpen={false}
            />
        </>
    );
}
