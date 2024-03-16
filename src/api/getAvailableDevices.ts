import webAPIFetchWithJSON from "./fetch";
import Device from "./types/Device";

function getAvailableDevices(): Promise<{ devices: Device[] }> {
  return webAPIFetchWithJSON("me/player/devices");
}

export default getAvailableDevices;
