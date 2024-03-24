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

function getPlaylistFoldersWithDisabled(
  folderID: string,
  folders: Folder[],
  disabled: Set<string>,
  trail: number[],
): string[] {
  return folders
    .filter((folder) => folder.id == folderID)[0]
    .items.filter((_, i) => {
      trail.push(i);
      if (disabled.has(trail.toString())) {
        trail.pop();
        return false;
      } else {
        trail.pop();
        return true;
      }
    })
    .flatMap((item, i) => {
      if (item.kind == SubitemKind.Folder) {
        trail.push(i);
        const subfolders = getPlaylistFoldersWithDisabled(
          item.itemID,
          folders,
          disabled,
          trail,
        );
        trail.pop();
        return subfolders;
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
  const playlists = getPlaylistFoldersWithDisabled(
    folderID,
    folders,
    disabled,
    [],
  );
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
