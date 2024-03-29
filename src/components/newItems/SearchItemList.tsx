import React from "react";
import HideScrollBar from "@/css/HideScrollBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

/**
 *
 * @param name adds a title above the item list
 * @param children is the items to include in the list
 */
export default function SearchItemList({
  name,
  children,
}: {
  name?: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div>
      {name ? (
        <>
          <h2 style={{ display: "inline-block" }}>{name}</h2>
          <span
            style={{
              borderTop: "2px solid black",
              width: "50%",
              marginLeft: "0.5rem",
              display: "inline-block",
            }}
          ></span>
        </>
      ) : null}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "hidden",
          gap: "0.3rem",
          position: "relative",
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            right: "0",
            top: "0",
            height: "100%",
            width: "4rem",
            background:
              "linear-gradient(to right, transparent 0%, #9e9e9e 100%)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={{ width: "60%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
