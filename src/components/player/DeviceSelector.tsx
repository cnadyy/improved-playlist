import Device from "@/api/types/Device";
import { useState } from "react";
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";

const RefreshButton = styled(FontAwesomeIcon)`
    padding: 1.09rem;
    border: solid 0px;
    border-radius: 0px 4px 4px 0px;
    border-left-width: 0.5px;
    border-color: gray;
    &:hover {
        background-color: #bbbbbb;
    }
`;

const CurrentDevice = styled.div<{ show: boolean; length: number }>`
    padding: 0.625rem;
    width: 200px;
    //border: solid 0.5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: ${(props) =>
        props.show && props.length > 1 ? "0px 0px 0px 4px" : "4px 0px 0px 4px"};
    //border-color: ${(props) => (props.show ? "darkgray" : "gray")};
    background-color: ${(props) => (props.show ? "lightgray" : "unset")};
    &:hover {
        background-color: #bbbbbb;
    }
`;

const OtherDevices = styled.div`
    position: absolute;
    left: 0;
    width: 220.5px;
    bottom: 100%;
`;

const OtherDevice = styled.div<{ isFirst: boolean }>`
    padding: 10px;
    border: solid 0.5px;
    border-color: darkgray;
    border-radius: ${(props) => (props.isFirst ? "4px 4px 0px 0px" : "0px")};
    background-color: #ffffff;
    &:hover {
        background-color: #bbbbbb;
    }
`;

function DeviceSelector({
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
                <OtherDevices>
                    {devices
                        .map((dev, i) => {
                            return { dev, i };
                        })
                        .filter((item) => item.i != currentPlayer)
                        .map((item, index) => {
                            const device = item.dev;
                            return (
                                <OtherDevice
                                    key={device.id}
                                    isFirst={index == 0}
                                    onClick={() => {
                                        setShow(!show);
                                        setCurrentPlayer(item.i);
                                    }}
                                >
                                    <DeviceLabel
                                        name={device.name}
                                        type={device.type}
                                    />
                                </OtherDevice>
                            );
                        })}
                </OtherDevices>
            ) : null}
            <div
                css={css`
                    display: flex;
                    align-items: center;
                `}
            >
                <CurrentDevice
                    onClick={() => setShow(!show)}
                    show={show}
                    length={devices.length}
                >
                    <div style={{ width: 150 }}>
                        <DeviceLabel
                            name={
                                currentDevice
                                    ? devices[currentPlayer].name
                                    : "No devices found"
                            }
                            type={
                                currentDevice
                                    ? devices[currentPlayer].type
                                    : "No devices found"
                            }
                        />
                    </div>
                    <FontAwesomeIcon
                        icon={show ? faAngleUp : faAngleDown}
                        size="xl"
                    />
                </CurrentDevice>
                <RefreshButton
                    icon={faRefresh}
                    onClick={() => updateDevices()}
                    size="lg"
                />
            </div>
        </div>
    );
}

function DeviceLabel({ name, type }: { name: string; type: string }) {
    return (
        <div
            css={css`
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            `}
        >
            {name}
            <div style={{ color: "gray", fontSize: 12 }}>{type}</div>
        </div>
    );
}

export default DeviceSelector;
