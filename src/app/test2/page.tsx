"use client";

import setFolderList from "@/api/setFolderList";
import React from "react";
import folders from "@mock/subfolders.json";

export default function test(): React.ReactNode {
  return (
    <div>
      <button onClick={() => setFolderList(folders)}>
        click me to set folder test data
      </button>
    </div>
  );
}
