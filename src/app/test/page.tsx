"use client";

import { useEffect, useState } from "react";
import getUserData from "@api/getUserData";
import queueTrack from "@api/queueTrack";
import UserPlaylists from "@/components/UserPlaylists";
import startResumePlayback from "@api/startResumePlayback";
import FolderExporer from "@/components/FolderExplorer";
import Folder, { SubitemKind } from "@/api/types/Folder";

function getDisplayName(setDisplayName: any) {
  getUserData().then((res) => setDisplayName(res.display_name));
}

export default function Profile() {
  const [displayName, setDisplayName] = useState("loading...");

  useEffect(() => {
    getDisplayName(setDisplayName);
  }, []);

  function playTrack() {
    queueTrack(encodeURIComponent("spotify:track:7irQdnDBovK2AVSBilasDZ")).then(
      (r) =>
        // FIXME: Handle error
        r,
    );
  }

  function playPlaylist(playlist: Playlist) {
    startResumePlayback(playlist.uri);
  }

  const [folders, setFolders] = useState<Folder[]>([
    {
      name: "Hi there",
      id: "Hi there",
      items: [
        {
          kind: SubitemKind.Folder,
          itemID: 1,
        },
        {
          kind: SubitemKind.Folder,
          itemID: 3,
        },
      ],
      color: "red",
      open: true,
    },
    {
      name: "Hi there 2",
      id: "Hi there 2",
      items: [
        {
          kind: SubitemKind.Folder,
          itemID: 2,
        },
        {
          kind: SubitemKind.SpotifyURI,
          itemID: "This is a test",
        },
      ],
      color: "blue",
      open: true,
    },
    {
      name: "Hi there 3",
      id: "Hi there 2",
      items: [],
      color: "blue",
      open: true,
    },
    {
      name: "Ok thene",
      id: "Hi there 2",
      items: [],
      color: "blue",
      open: true,
    },
  ]);

  function updateFolder(itemID: number) {
    const newFolders = { ...folders };
    newFolders[itemID].open = !newFolders[itemID].open;
    setFolders(newFolders);
  }

  return (
    <>
      <a>{displayName}</a>
      <a style={{ color: "blue", cursor: "pointer" }} onClick={playTrack}>
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
    </>
  );
}
