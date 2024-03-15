import webAPIFetchWithRefresh from "@api/fetch";

async function startResumePlayback(contextURI: string) {
    return webAPIFetchWithRefresh("me/player/play", {
        method: "PUT",
        body: JSON.stringify({
            context_uri: contextURI,
            position_ms: 0,
        })
    })
}

export default startResumePlayback;