import Device from "@/api/types/Device";
import { useState } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faRefresh,
} from "@fortawesome/free-solid-svg-icons";

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
            {show ? (
                // FIXME: this is bade a double absolute?
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        width: 200,
                        top: 0,
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            width: 200,
                            bottom: "-100%",
                        }}
                    >
                        {devices
                            .map((dev, i) => {
                                return { dev, i };
                            })
                            .filter((item) => item.i != currentPlayer)
                            .map((item, index) => {
                                const dev = item.dev;
                                const i = item.i;
                                const isFirst = index == 0;
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
                                            border-radius: ${isFirst
                                                ? "4px 4px 0px 0px"
                                                : "0px"};
                                            background-color: #ffffff;
                                            &:hover {
                                                background-color: #bbbbbb;
                                            }
                                        `}
                                    >
                                        <div>{dev.name}</div>
                                        <div
                                            style={{
                                                color: "gray",
                                                fontSize: 12,
                                            }}
                                        >
                                            {dev.type}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            ) : null}
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
                            //border: solid 0.5px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border-radius: ${show && devices.length > 1
                                ? "0px 0px 0px 4px"
                                : "4px 0px 0px 4px"};
                            //border-color: ${show ? "darkgray" : "gray"};
                            background-color: ${show ? "lightgray" : "#eee"};
                            &:hover {
                                background-color: #bbbbbb;
                            }
                        `}
                    >
                        <div
                            css={css`
                                width: 150px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                            `}
                        >
                            {currentDevice
                                ? devices[currentPlayer].name
                                : "No devices found"}
                            <div style={{ color: "gray", fontSize: 12 }}>
                                {currentDevice
                                    ? devices[currentPlayer].type
                                    : "No devices found"}
                            </div>
                        </div>
                        <FontAwesomeIcon
                            icon={show ? faAngleUp : faAngleDown}
                            size="xl"
                        />
                    </div>
                </div>
                <div>
                    <FontAwesomeIcon
                        icon={faRefresh}
                        onClick={() => updateDevices()}
                        size="lg"
                        css={css`
                            padding: 1.09rem;
                            border: solid 0px;
                            border-radius: 0px 4px 4px 0px;
                            border-left-width: 0.5px;
                            border-color: gray;
                            &:hover {
                                background-color: #bbbbbb;
                            }
                        `}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerSelector;
