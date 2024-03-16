import Device from "@/api/types/Device";
import { useState } from "react";

function PlayerSelector({
  devices,
  currentPlayer,
  setCurrentPlayer,
}: {
  devices: Device[];
  currentPlayer: number;
  setCurrentPlayer: (device: number) => void;
}) {
  const [show, setShow] = useState(false);

  const currentDevice = devices[currentPlayer];
  return (
    <div
      onClick={() => setShow(!show)}
      style={{
        position: "relative",
        display: "inline-block",
        padding: 10,
        borderRadius: 4,
        borderColor: show ? "red" : "gray",
        border: "solid 0.5px",
        width: 200,
      }}
    >
      <div>
        {currentDevice ? devices[currentPlayer].name : "No devices found"}
      </div>
      <div style={{ color: "gray", fontSize: 12 }}>
        {currentDevice ? devices[currentPlayer].type : "No devices found"}
      </div>
      {show ? (
        <div
          style={{ position: "absolute", marginTop: 10, left: 0, width: 200 }}
        >
          {devices
            .map((dev, i) => {
              return { dev, i };
            })
            .filter((item) => item.i != currentPlayer)
            .map((item) => {
              const dev = item.dev;
              const i = item.i;
              return (
                <div
                  style={{ padding: 10 }}
                  key={dev.id}
                  onClick={() => {
                    setCurrentPlayer(i);
                  }}
                >
                  <div>{dev.name}</div>
                  <div style={{ color: "gray", fontSize: 12 }}>{dev.type}</div>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}

export default PlayerSelector;
