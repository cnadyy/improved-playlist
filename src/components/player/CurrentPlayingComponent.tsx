import { usePlaybackState } from "@/api/hooks/spotify/usePlaybackSDK";
import getQueue from "@/api/spotify/get/queue";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function CurrentlyPlayingComponent() {
    const playbackState = usePlaybackState();
    if (playbackState) console.log(playbackState)
    const { data } = useQuery({
        queryKey: ["queue"],
        queryFn: () => {
            return getQueue();
        },
        refetchInterval: 60 * 1000,
    });
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div
                style={{
                    width: "3rem",
                    height: "3rem",
                    position: "relative",
                    backgroundColor: "gray",
                }}
            >
                {data?.currently_playing && (
                    <Image
                        loader={() =>
                            data.currently_playing.album.images[0].url
                        }
                        src={data.currently_playing.album.images[0].url}
                        fill
                        sizes="3rem"
                        alt=""
                    />
                )}
            </div>

            <div
                style={{
                    marginLeft: "0.5rem",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div>{data?.currently_playing?.name || "None"}</div>
                <div style={{ color: "gray", fontSize: "0.8rem" }}>
                    No author
                </div>
            </div>
        </div>
    );
}
