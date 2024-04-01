import React from "react";
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
    full = false,
    expandList,
}: {
    name?: string;
    children: React.ReactNode;
    full?: boolean;
    expandList?: () => void;
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
                    overflowX: "hidden",
                    gap: "0.3rem",
                    position: "relative",
                    ...(full ? { flexWrap: "wrap" } : { flexWrap: "nowrap" }),
                }}
            >
                {children}
                {!full && expandList ? (
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
                            style={{
                                width: "60%",
                                height: "100%",
                                cursor: "pointer",
                            }}
                            onClick={expandList}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
