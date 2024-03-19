"use client";

export default function page() {
  return (
    <div>
      <h1>This should contain:</h1>
      <ol>
        <li>Query parameter id to specify an existing folder</li>
        <li>
          The ability to add playlists
          <ul>
            <li>Should have top user playlists at the bottom of the page</li>
            <li>
              A button to go to a dedicated searching screen for any playlist
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
}
