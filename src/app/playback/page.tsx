"use client";

import FolderDetailsComponent from "@/components/FolderDetails";
import { useSearchParams } from "next/navigation";
import testData from "@mock/subfolders.json";

export default function Page() {
  const searchParams = useSearchParams();

  const folderID = searchParams.get("id");

  const folder = testData[0];

  return (
    <div>
      <FolderDetailsComponent folder={folder} />
      <a>{folderID}</a>
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
