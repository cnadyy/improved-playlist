import { webAPIFetch } from "@api/fetch";

function queueTrack(trackID: string) {
  return webAPIFetch(`me/player/queue?uri=${trackID}`, {
    method: "POST",
  });
}

export default queueTrack;
