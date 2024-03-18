// user authenticated network requests
// TODO: Handle "No active device found" 404 errors seperately, explaining remote control.

import CLIENT_ID from "@/app/secrets";

// will always be defined. This surpresses
// build step error "window is not defined"
if (typeof window != "undefined")
  var accessToken = localStorage.getItem("access_token");
const APIURL = "https://api.spotify.com/v1/";

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return;
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  if (response.access_token && response.refresh_token) {
    accessToken = response.access_token;
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
  }
}

let refreshTokenStatus: Promise<void> | null = null;

async function webAPIFetch(
  resource: string,
  options?: RequestInit,
  retry: boolean = true,
): Promise<Response> {
  if (!accessToken || accessToken == "undefined") {
    return Promise.reject(`You must sign in...`);
  }
  return fetch(APIURL + resource, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    ...options,
  }).then(async (res) => {
    if (res.status != 401) {
      return res;
    }
    const response = await res.clone().json();
    if (
      response.error &&
      (response.error.message == "The access token expired" ||
        response.error.message == "Invalid access token")
    ) {
      if (retry) {
        // This is super smart, thank you andreyka26 for the blog on handling refresh tokens
        // Uses a functioin pointer so we are able to await it. This should stop the race
        // condition from occuring.
        if (!refreshTokenStatus) {
          refreshTokenStatus = refreshAccessToken();
        }
        await refreshTokenStatus;
        return await webAPIFetch(resource, options, false);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect so the use can sign in again.
        window.location.href = "/";
        return Promise.reject("Need to resign in");
      }
    } else {
      return res;
    }
  });
}

async function webAPIFetchWithJSON(
  resource: string,
  options?: RequestInit,
): Promise<any> {
  return webAPIFetch(resource, options, true).then((res) => res.json());
}

export { webAPIFetchWithJSON as default, webAPIFetch };
