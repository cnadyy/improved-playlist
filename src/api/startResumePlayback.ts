import webAPIFetchWithRefresh from "@api/fetch";

async function startResumePlayback({
  contextURI,
  uris,
  deviceID,
}: {
  contextURI?: string;
  uris?: string[];
  deviceID?: string;
}) {
  const body: { context_uri?: string; uris?: string[]; position_ms: number } = {
    position_ms: 0,
  };

  if (contextURI) {
    body["context_uri"] = contextURI;
  }

  if (uris) {
    body["uris"] = uris;
  }

  return webAPIFetchWithRefresh(
    `me/player/play${deviceID ? `?device_id=${deviceID}` : ``}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}

export default startResumePlayback;
