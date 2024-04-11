import fetch, { useWebAPI } from "@api/spotify/fetch";
import { UseQueryResult } from "@tanstack/react-query";

export default function getQueue(): Promise<Queue> {
    return fetch("me/player/queue");
}

export function useQueue(): UseQueryResult<Queue> {
    return useWebAPI("me/player/queue");
}
