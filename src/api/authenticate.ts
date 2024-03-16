import CLIENT_ID from "../app/secrets";

const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const generateAuthorisationURL = (
  codeChallenge: string,
  codeVerifier: string,
): string => {
  const clientId = CLIENT_ID;
  const redirectUri = "http://localhost:3000/redirect";

  const scope = [
    [
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-currently-playing",
    ],
    ["playlist-read-private", "playlist-read-collaborative"],
    ["user-library-read"],
  ]
    .flat()
    .join(" ");
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // generated in the previous step
  window.localStorage.setItem("code_verifier", codeVerifier);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
};

export default async function () {
  const codeVerifier = generateRandomString(72);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  window.location.href = generateAuthorisationURL(codeChallenge, codeVerifier);
}
