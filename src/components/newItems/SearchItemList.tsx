import React from "react";

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
                    <p
                        onClick={expandList}
                        style={{
                            display: "inline-block",
                            marginLeft: "1rem",
                            textDecoration: "underline",
                            cursor: "pointer",
                        }}
                    >
                        see all
                    </p>
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
            </div>
        </div>
    );
}
