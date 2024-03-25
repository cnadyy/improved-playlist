"use client";

import { useEffect, useState } from "react";
import getUserData from "@api/getUserData";
import queueTrack from "@api/queueTrack";
import UserPlaylists from "@/components/UserPlaylists";
import startResumePlayback from "@api/startResumePlayback";
import Folder, { SubitemKind } from "@/api/types/Folder";
import getAvailableDevices from "@/api/getAvailableDevices";
import PlayerSelector from "@/components/PlayerSelector";
import Device from "@/api/types/Device";
import subfolders from "@mock/subfolders.json";
import getPlaylist from "@/api/getPlaylist";
import mock from "@mock/subfolders.json";

function getDisplayName(setDisplayName: (display: string) => void) {
  getUserData().then((res) => setDisplayName(res.display_name));
}

export default function Profile() {
  const [displayName, setDisplayName] = useState("loading...");
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);

  useEffect(() => {
    getDisplayName(setDisplayName);
    getAvailableDevices().then((res) => setDevices(res.devices));
  }, []);

  function playTrack() {
    queueTrack(
      encodeURIComponent("spotify:track:7irQdnDBovK2AVSBilasDZ"),
      devices[currentPlayer].id,
    ).then(
      (r) =>
        // FIXME: Handle error
        r,
    );
  }

  function playPlaylist() {
    startResumePlayback({
      uris: [
        "spotify:track:7irQdnDBovK2AVSBilasDZ",
        "spotify:track:4iV5W9uYEdYUVa79Axb7Rh",
        "spotify:track:1301WleyT98MSxVHPZCA6M",
      ],
      deviceID: devices[currentPlayer].id,
    });
  }

  function getPlaylistFolders(folderID: string, folders: Folder[]): string[] {
    console.log(folderID);
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

  async function playFolder(folderID: string, folders: Folder[]) {
    console.log(folders);
    const playlists = getPlaylistFolders(folderID, folders);
    Promise.all(
      playlists.flatMap(async (playlistURI) =>
        getPlaylist(playlistURI).then((obj) => {
          console.log(obj);
          return obj.tracks.items.map((track) => track.track.uri);
        }),
      ),
    ).then((urisArr) => {
      const uris = urisArr.flatMap((track) => track);
      startResumePlayback({
        uris: uris,
        deviceID: devices[currentPlayer].id,
      });
    });
  }

  const [folders, setFolders] = useState<Folder[]>(subfolders);

  function updateDevices() {
    getAvailableDevices().then((res) => setDevices(res.devices));
  }

  return (
    <>
      <a>{displayName}</a>
      <a style={{ color: "blue", cursor: "pointer" }} onClick={playPlaylist}>
        {" "}
        play the celesete
      </a>
      <a
        style={{ color: "green", cursor: "pointer" }}
        onClick={() => playFolder("xxx-xxx", mock)}
      >
        {" "}
        play the playlist
      </a>
      <h3>Folder explorer</h3>
      {/*<FolderExporer folders={folders} rootId={"xxx-xxx"} />*/}
      <h3>User playlists</h3>
      <UserPlaylists />
      <PlayerSelector
        devices={devices}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        updateDevices={updateDevices}
      />
    </>
  );
}
