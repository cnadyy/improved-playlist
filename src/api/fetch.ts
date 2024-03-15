// user authenticated network requests

// will always be defined. This surpresses
// build step error "window is not defined"
import CLIENT_ID from "@/app/secrets";

if (typeof window != "undefined") var accessToken = localStorage.getItem('access_token');
const APIURL = "https://api.spotify.com/v1/";


async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID
        }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
}

async function webAPIFetch(resource: string, options: RequestInit): Promise<Response> {
    return fetch(APIURL + resource, {
        headers: {
            Authorization: "Bearer " + accessToken
        },
        ...options
    });
}

async function webAPIFetchWithRefresh(resource: string, options?: RequestInit): Promise<any> {
    return fetch(APIURL + resource, {
        headers: {
            Authorization: "Bearer " + accessToken
        },
        ...options
    }).then(res => {
        if (res.status != 401 && res.status != 200) {
            return Promise.reject(`Unable to ensure the output is JSON with the status code ${res.status}`)
        } else {
            return res
        }
    })
        .then(res => res.json())
        .then(async res => {
            if (res.error && res.error.message == "The access token expired") {
                await refreshAccessToken();
                return await webAPIFetchWithRefresh(resource, options);
            } else {
                return res;
            }
        });
}

export default webAPIFetchWithRefresh;