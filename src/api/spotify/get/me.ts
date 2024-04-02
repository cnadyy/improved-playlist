import fetch from "@api/spotify/fetch";

async function getUserData() {
    return await fetch("me", { method: "GET" });
}

export default getUserData;
