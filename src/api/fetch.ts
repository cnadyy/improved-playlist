// user authenticated network requests

// will always be defined. This surpresses
// build step error "window is not defined"
if (typeof window != "undefined") var accessToken = localStorage.getItem('access_token');
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