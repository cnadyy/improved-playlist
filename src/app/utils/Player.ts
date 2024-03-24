import getPlaylist from "@/api/getPlaylist";
import startResumePlayback from "@/api/startResumePlayback";
import Folder, { SubitemKind } from "@/api/types/Folder";

function getPlaylistFolders(
  folderID: string,
  folders: Folder[],
  trail: number[],
  disabled: Set<string>,
): string[] {
  return folders
    .filter((folder) => folder.id == folderID)[0]
    .items.filter((_, i) => {
      return !disabled.has([...trail, i].toString());
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
  disabled: Set<string>,
  deviceID?: string,
) {
  const playlists = getPlaylistFolders(folderID, folders, [], disabled);
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
