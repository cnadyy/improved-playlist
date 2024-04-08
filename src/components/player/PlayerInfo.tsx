import {
    faBackward,
    faForward,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayerSelector from "./PlayerSelector";
import { useEffect, useState } from "react";
import Device from "@api/types/Device";
import getAvailableDevices from "@api/spotify/get/devices";

export default function PlayerInfo() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<number>(0);

    useEffect(() => {
        getAvailableDevices().then((res) => setDevices(res.devices));
    }, []);

    function updateDevices() {
        getAvailableDevices().then((res) => setDevices(res.devices));
    }

    return (
        <div
            style={{
                display: "grid",
                position: "fixed",
                bottom: 0,
                width: "100%",
                height: "4rem",
                gridTemplateColumns: "1fr 1fr 1fr",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#eee",
                boxShadow: "#dddddd 0 -5px 30px 5px",
            }}
        >
            <div style={{ marginLeft: "0.5rem" }}>Currently playing</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <FontAwesomeIcon
                    size="lg"
                    icon={faBackward}
                    style={{ margin: "1rem" }}
                />
                <FontAwesomeIcon
                    size="lg"
                    icon={faPlay}
                    style={{ margin: "1rem" }}
                />
                <FontAwesomeIcon
                    size="lg"
                    icon={faForward}
                    style={{ margin: "1rem" }}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    height: "100%",
                    alignItems: "center",
                    marginRight: "0.5rem",
                }}
            >
                <PlayerSelector
                    devices={devices}
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}
                    updateDevices={updateDevices}
                />
            </div>
        </div>
    );
}
