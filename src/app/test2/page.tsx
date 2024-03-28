"use client";

import setFolderList from "@/api/setFolderList";
import React, { useState } from "react";
import folders from "@mock/subfolders.json";
import AddItem from "@/components/AddItem";
import { Auth, Db } from "@/api/firebase/createApp";
import { doc, getDoc } from "firebase/firestore";

export default function test(): React.ReactNode {
  const [displayItemModal, setDisplayItemModal] = useState(false);
  const [dbData, setDbDAta] = useState<Object>({});

  const readSomeData = () => {
    const userDoc = doc(Db, "userFolders", Auth.currentUser!.uid);
    getDoc(userDoc)
      .then(data => {
        setDbDAta(data.get("whatis"));
      })
      .catch(e => {
        setDbDAta({ "error": e});
      });
  }
  return (
    <div>
      <button onClick={() => setFolderList(folders)}>
        click me to set folder test data
      </button>
      <button onClick={() => setDisplayItemModal(true)}>Show the modal</button>
      <AddItem showModal={displayItemModal} closeModal={() => setDisplayItemModal(false)}/>
      <button onClick={readSomeData}>Read some firebase data!</button>
      <p>{JSON.stringify(dbData)}</p>
    </div>
  );
}
