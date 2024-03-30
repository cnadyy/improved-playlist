import React, { CSSProperties, useEffect, useRef, useState } from "react";
import FilterOptions from "@api/types/FilterOptions";

const filterStyles: CSSProperties = {
  borderRadius: "10px",
  backgroundColor: "#dddada",
  border: "none",
  width: "425px",
  color: "#9f9f9f",
  padding: "0.4rem 1rem",
  height: "7.5rem",
  display: "flex",
  flexDirection: "column",
};

export default function FilterDialog({
  showFilters,
  closeFilters,
  filter,
  setFilter
}: {
  showFilters: boolean;
  closeFilters: () => void;
  filter: FilterOptions;
  setFilter: (arg0: FilterOptions) => void;
}): React.ReactNode {
  const ref = useRef<HTMLDialogElement>(null);

  console.log(showFilters)

  useEffect(() => {
    if (showFilters) ref.current?.show();
    else ref.current?.close();
  }, [showFilters]);

  const Item = ({ item }: { item: FilterOptions }) => (
    <p
      aria-selected={item == filter}
      style={{
        padding: "0.2rem 0.4rem",
        fontSize: "1.3rem",
        margin: "0",
        cursor: "pointer",
        ...(item == filter
          ? {
              backgroundColor: "#bcbcbc",
              borderRadius: "5px",
              fontSize: "1.3rem",
              margin: "0",
              color: "#dddada",
            }
          : {}),
      }}
      onClick={() => setFilter(item)}
    >
      {item}
    </p>
  );

  return (
    <dialog
      ref={ref}
      style={{
        padding: "0",
        border: "none",
        top: "3rem",
        right: "-15rem",
        borderRadius: "14px",
        zIndex: "2",
      }}
    >
      <div style={filterStyles}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: "0", fontWeight: "300" }}>filter</h2>
          <div
            role="button"
            style={{
              width: "2rem",
              height: "0.5rem",
              backgroundColor: "#bcbcbc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={closeFilters}
          />
        </div>
        <div
          role="radiogroup"
          style={{
            display: "flex",
            gap: "1rem",
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          <Item item={FilterOptions.PUBLIC} />
          <Item item={FilterOptions.PLAYLISTS} />
          <Item item={FilterOptions.FOLDERS} />
          <Item item={FilterOptions.NONE} />
        </div>
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "end",
            flex: "1",
          }}
        >
          <p
            style={{ cursor: "pointer", margin: "0" }}
            onClick={closeFilters}
            role="button"
          >
            confirm
          </p>
        </div>
      </div>
    </dialog>
  );
}
