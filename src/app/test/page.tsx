"use client";

import { useEffect, useState } from "react";
import getUserData from "@api/getUserData";
import queueTrack from "@api/queueTrack";
import UserPlaylists from "@/components/UserPlaylists";
import startResumePlayback from "@api/startResumePlayback";
import FolderExporer from "@/components/FolderExplorer";
import Folder from "@/api/types/Folder";
import getAvailableDevices from "@/api/getAvailableDevices";
import PlayerSelector from "@/components/PlayerSelector";
import Device from "@/api/types/Device";
import subfolders from "@mock/subfolders.json";

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
      uris: ["spotify:track:7irQdnDBovK2AVSBilasDZ"],
      deviceID: devices[currentPlayer].id,
    });
  }

  const [folders, setFolders] = useState<Folder[]>(subfolders);

  function updateFolder(itemID: number) {
    const newFolders = { ...folders };
    newFolders[itemID].open = !newFolders[itemID].open;
    setFolders(newFolders);
  }

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
      <h3>Folder explorer</h3>
      <FolderExporer
        onDropdownClick={updateFolder}
        folders={folders}
        rootId={0}
      />
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
