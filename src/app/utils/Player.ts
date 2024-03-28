import getPlaylist from "@/api/getPlaylist";
import startResumePlayback from "@/api/startResumePlayback";
import Folder, { SubitemKind } from "@/api/types/Folder";

function getPlaylistFolders(
  folderID: string,
  folders: Folder[],
  trail: number[],
  disabled: number[][],
): string[] {
  return folders
    .filter((folder) => folder.id == folderID)[0]
    .items.filter((_, i) => {
      return !disabled.some((f) => f.toString() == [...trail, i].toString());
    })
    .flatMap((item, i) => {
      if (item.kind == SubitemKind.Folder) {
        trail.push(i);
        const subfolder = getPlaylistFolders(
          item.itemID,
          folders,
          trail,
          disabled,
        );
        trail.pop();
        return subfolder;
      } else {
        return item.itemID;
      }
    });
}

async function playFolder(
  folderID: string,
  folders: Folder[],
  disabled: number[][],
  deviceID?: string,
) {
  const playlists = getPlaylistFolders(folderID, folders, [], disabled);
  Promise.all(
    playlists.flatMap(async (playlistURI) =>
      getPlaylist(playlistURI).then(
        (obj) => {
          return obj.tracks.items.map((track) => track.track.uri);
        },
        () => [],
      ),
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
