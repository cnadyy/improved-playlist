import Device from "@/api/types/Device";
import { useState } from "react";
import { css } from "@emotion/react";

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
      css={css`
        position: relative;
        display: inline-block;
        width: 200px;
      `}
    >
      <div
        css={css`
          padding: 0.625rem;
          border: solid 0.5px;
          border-radius: ${show ? "4px 4px 0px 0px" : "4px"};
          border-color: ${show ? "darkgray" : "gray"};
          background-color: ${show ? "lightgray" : "white"};
          &:hover {
            background-color: #bbbbbb;
          }
        `}
      >
        <div>
          {currentDevice ? devices[currentPlayer].name : "No devices found"}
        </div>
        <div style={{ color: "gray", fontSize: 12 }}>
          {currentDevice ? devices[currentPlayer].type : "No devices found"}
        </div>
      </div>
      {show ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 200,
          }}
        >
          {devices
            .map((dev, i) => {
              return { dev, i };
            })
            .filter((item) => item.i != currentPlayer)
            .map((item, index, arr) => {
              const dev = item.dev;
              const i = item.i;
              const isLast = index == arr.length - 1;
              return (
                <div
                  key={dev.id}
                  onClick={() => {
                    setCurrentPlayer(i);
                  }}
                  css={css`
                    padding: 10px;
                    border: solid 0.5px;
                    border-color: darkgray;
                    border-radius: ${isLast ? "0px 0px 4px 4px" : "0px"};
                    &:hover {
                      background-color: #bbbbbb;
                    }
                  `}
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
