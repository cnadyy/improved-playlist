// user authenticated network requests

const accessToken = localStorage.getItem('access_token');
const APIURL = "https://api.spotify.com/v1/";

function webAPIfetch(resource: string, options: RequestInit) {
    return fetch(APIURL + resource, {
        headers: {
            Authorization: "Bearer " + accessToken
        },
        ...options
    });
}

export default webAPIfetch;