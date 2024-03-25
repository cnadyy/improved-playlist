import getFolder from "@/api/getFolder";
import getPlaylist from "@/api/getPlaylist";
import { SubitemKind } from "@/api/types/Folder";
import { cache, useEffect, useState } from "react";

export default function ItemName({
  id,
  kind,
}: {
  id: string;
  kind: SubitemKind;
}) {
  const [name, setName] = useState("Loading...");

  useEffect(() => {
    if (kind == SubitemKind.SpotifyURI) {
      getPlaylist(id).then(
        (playlist) => {
          setName(playlist.name);
        },
        (err) => {
          if (err.error) {
            setName("Private or invalid playlist");
          }
        },
      );
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
  }, [id, kind]);

  return <>{name}</>;
}
