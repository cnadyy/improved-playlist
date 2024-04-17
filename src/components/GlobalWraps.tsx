import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Unauthenticated from "@/components/Unauthenticated";
import { isAuthenticated } from "@/api/util";
import PlayerInfo from "@/components/player/PlayerInfo";
import Loading from "./Loading";
import { getUser } from "@/api/firebase/get/user";
import { Auth } from "@/api/firebase/createApp";

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
    const {
        isLoading,
        data: authBool,
        refetch,
    } = useQuery({
        queryKey: ["login"],
        queryFn: async () => {
            return (
                (await isAuthenticated()) &&
                (await getUser(Auth.currentUser!.uid)) != undefined
            );
        },
    });

    if (isLoading && !exception) {
        return <Loading />;
    }

    return (
        <>
            {authBool || exception ? (
                children
            ) : (
                <Unauthenticated refetch={refetch} />
            )}
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
