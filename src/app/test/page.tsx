"use client";

/* eslint @typescript-eslint/no-unused-vars: 0 */

import { useEffect, useState, useRef } from "react";
import getUserData from "@api/spotify/get/me";
import queueTrack from "@api/spotify/set/queueTrack";
import UserPlaylists from "@/components/UserPlaylists";
import startResumePlayback from "@api/spotify/set/playbackToggle";
import getAvailableDevices from "@api/spotify/get/devices";
import DeviceSelector from "@/components/player/DeviceSelector";
import Device from "@/api/types/Device";
import { SpotifyController } from "../playback-test/SpotifyController";
import { useSpotifyDevice } from "@/api/hooks/spotify/usePlaybackSDK";

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

    function updateDevices() {
        getAvailableDevices().then((res) => setDevices(res.devices));
    }

    return (
        <>
            <a>{displayName}</a>
            <a
                style={{ color: "blue", cursor: "pointer" }}
                onClick={async () => {
                    alert("celeste.... play it...... the celeste.......");
                }}
            >
                {" "}
                play the celesete
            </a>
            <h3>Folder explorer</h3>
            {/*<FolderExporer folders={folders} rootId={"xxx-xxx"} />*/}
            <h3>User playlists</h3>
            <UserPlaylists />
            <DeviceSelector
                devices={devices}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
                updateDevices={updateDevices}
            />
        </>
    );
}
