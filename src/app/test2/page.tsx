"use client";

import setFolderList from "@/api/setFolderList";
import React, { useState } from "react";
import folders from "@mock/subfolders.json";
import AddItem from "@/components/newItems/AddItem";
import { Auth, Db } from "@/api/firebase/createApp";
import { doc, getDoc } from "firebase/firestore";
import FilterDialog from "@/components/newItems/FilterDialog";
import filterOptions from "@/api/types/FilterOptions";

export default function Test(): React.ReactNode {
  const [displayItemModal, setDisplayItemModal] = useState(false);
  const [dbData, setDbDAta] = useState<unknown>({});
  const [filter, setFilter] = useState<filterOptions>(filterOptions.NONE);
  const [fVisibile, setFvisible] = useState<boolean>(false);

  const readSomeData = () => {
    const folder = doc(Db, "folders", "rtQhD7YGAqYpB6b9Kzwl");
    getDoc(folder)
      .then((data) => {
        const whatis = data.get("name");
        console.log(whatis)
        setDbDAta(whatis);
      })
      .catch((e) => {
        setDbDAta({ error: e });
      });
  }

  return (
    <div>
      <button onClick={() => setFolderList(folders)}>
        click me to set folder test data
      </button>
      <button onClick={() => setDisplayItemModal(true)}>Show the modal</button>
      <AddItem
        showModal={displayItemModal}
        closeModal={() => setDisplayItemModal(false)}
      />
      <button onClick={readSomeData}>Read some firebase data!</button>
      <button onClick={() => setFvisible(true)}>Show the filters</button>
      <FilterDialog
        showFilters={fVisibile}
        closeFilters={() => setFvisible(false)}
        filter={filter}
        setFilter={(f) => setFilter(f)}
      />
      <p>{Auth.currentUser?.uid}</p>
      <p>{JSON.stringify(dbData)}</p>
    </div>
  );
}
