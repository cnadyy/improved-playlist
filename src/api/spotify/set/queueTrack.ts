import { webAPIFetch } from "@api/spotify/fetch";

function queueTrack(trackID: string, deviceID?: string) {
    return webAPIFetch(
        `me/player/queue?uri=${trackID}${deviceID ? `&device_id=${deviceID}` : ""}`,
        {
            method: "POST",
        },
    );
}

export default queueTrack;
