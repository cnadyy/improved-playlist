"use client";

import FolderDetailsComponent from "@/components/FolderDetails";
import { useSearchParams } from "next/navigation";
import { useFolderList } from "@/api/getFolderList";
import FolderExplorer from "@/components/FolderExplorer";
import { css } from "@emotion/react";

export default function Page() {
  const searchParams = useSearchParams();
  const folders = useFolderList();

  const folderID = searchParams.get("id");
  const folder = folders.find((folder) => folder.id == folderID);

  if (!folder || !folderID) {
    return <div>This folder does not exist</div>;
  }

  return (
    <div>
      <div
        css={css`
          margin: 2rem;
        `}
      >
        <FolderDetailsComponent folder={folder} />
      </div>
      <div
        css={css`
          margin: 2rem;
        `}
      >
        <FolderExplorer folders={folders} rootId={folderID} />
      </div>
      <h1>This should contain:</h1>
      <ol>
        <li>Query parameter id to identify an existing folder</li>
        <li>Ability to toggle playlists for playback within the folder</li>
        <li>Display playlist information including some songs</li>
        <li>A link to the edit screen for this playlist</li>
        <li>The ability to add the enabled playlists to the queue</li>
        <li>Currently playing information</li>
        <li>Skip song and skip playlist buttons</li>
      </ol>
    </div>
  );
}
