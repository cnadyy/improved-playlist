import getFolder from "@/api/getFolder";
import getPlaylist from "@/api/getPlaylist";
import { SubitemKind } from "@/api/types/Folder";
import { useEffect, useState } from "react";

const cache: { [key: string]: Promise<Playlist> } = {};

export default function ItemName({
  id,
  kind,
}: {
  id: string;
  kind: SubitemKind;
}) {
  const [name, setName] = useState("Loading...");

  useEffect(() => {
    async function resolve() {
      if (kind == SubitemKind.SpotifyURI) {
        if (!cache[id]) {
          cache[id] = getPlaylist(id);
          console.log(cache);
        }
        try {
          const playlist = await cache[id];
          setName(playlist.name);
        } catch (e) {
          setName("Private or invalid playlist");
        }
      } else {
        getFolder(id).then(
          (playlist) => {
            setName(playlist.name);
          },
          (err) => {
            if (err.error) {
              setName("Private or invalid folder");
            }
          },
        );
      }
    }
    resolve();
  }, [id, kind]);

  return <>{name}</>;
}
