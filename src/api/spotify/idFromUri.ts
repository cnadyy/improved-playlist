export default function uriToId(uri: SpotifyURI): string {
    return uri.split(":")[2];
}
