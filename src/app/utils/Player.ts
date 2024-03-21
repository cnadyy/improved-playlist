import getPlaylist from "@/api/getPlaylist";
import startResumePlayback from "@/api/startResumePlayback";
import Folder, { SubitemKind } from "@/api/types/Folder";

function getPlaylistFolders(folderID: string, folders: Folder[]): string[] {
  return folders
    .filter((folder) => folder.id == folderID)[0]
    .items.flatMap((item) => {
      if (item.kind == SubitemKind.Folder) {
        return getPlaylistFolders(item.itemID, folders);
      } else {
        return item.itemID;
      }
    });
}

async function playFolder(
  folderID: string,
  folders: Folder[],
  deviceID?: string,
) {
  const playlists = getPlaylistFolders(folderID, folders);
  Promise.all(
    playlists.flatMap(async (playlistURI) =>
      getPlaylist(playlistURI).then((obj) => {
        return obj.tracks.items.map((track) => track.track.uri);
      }),
    ),
  ).then((urisArr) => {
    const uris = urisArr.flatMap((track) => track);
    if (uris.length >= 0) {
      // Either this or reject
      startResumePlayback({
        uris,
        deviceID: deviceID,
      });
    }
  });
}

export default playFolder;
