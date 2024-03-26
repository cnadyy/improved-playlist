"use client";

import setFolderList from "@/api/setFolderList";
import React, { useState } from "react";
import folders from "@mock/subfolders.json";
import AddItem from "@/components/AddItem";

export default function test(): React.ReactNode {
  const [displayItemModal, setDisplayItemModal] = useState(true);
  return (
    <div>
      <button onClick={() => setFolderList(folders)}>
        click me to set folder test data
      </button>
      <button onClick={() => setDisplayItemModal(true)}>Show the modal</button>
      <AddItem showModal={displayItemModal} closeModal={() => setDisplayItemModal(false)}/>
    </div>
  );
}
