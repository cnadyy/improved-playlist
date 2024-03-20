import Device from "@/api/types/Device";
import { useState } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faRefresh, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";

function PlayerSelector({
  devices,
  currentPlayer,
  setCurrentPlayer,
  updateDevices,
}: {
  devices: Device[];
  currentPlayer: number;
  setCurrentPlayer: (device: number) => void;
  updateDevices: () => void;
}) {
  const [show, setShow] = useState(false);

  const currentDevice = devices[currentPlayer];
  return (
    <div
      css={css`
        position: relative;
        display: inline-block;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <div style={{ width: 200 }}>
          <div
            onClick={() => setShow(!show)}
            css={css`
              padding: 0.625rem;
              border: solid 0.5px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-radius: ${show && devices.length > 1
                ? "4px 0px 0px 0px"
                : "4px 0px 0px 4px"};
              border-color: ${show ? "darkgray" : "gray"};
              background-color: ${show ? "lightgray" : "white"};
              &:hover {
                background-color: #bbbbbb;
              }
            `}
          >
            <div>
              {currentDevice ? devices[currentPlayer].name : "No devices found"}
              <div style={{ color: "gray", fontSize: 12 }}>
                {currentDevice
                  ? devices[currentPlayer].type
                  : "No devices found"}
              </div>
            </div>
            <FontAwesomeIcon icon={show ? faSquareCaretUp : faSquareCaretDown} size="xl" />
          </div>
        </div>
        <div>
          <FontAwesomeIcon
            icon={faRefresh}
            onClick={() => updateDevices()}
            size="lg"
            css={css`
              padding: 1.06rem;
              border: solid 0.5px;
              border-radius: 0px 4px 4px 0px;
              border-left-width: 0px;
              border-color: gray;
              &:hover {
                background-color: #bbbbbb;
              }
            `}
          />
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
                    setShow(!show);
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
