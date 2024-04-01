import React, {
    CSSProperties,
    Children,
    Dispatch,
    SetStateAction,
} from "react";
import SearchBar from "./SearchBar";
import Link from "next/link";

const bannerStyle: CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    columnGap: "4rem",
    rowGap: "1rem",
    padding: "0 2rem",
    boxSizing: "border-box",
    alignItems: "center",
};

const bannerItemStyle: CSSProperties = {
    height: "2rem",
    boxSizing: "border-box",
};

/**
 *
 * @param children anything you like
 * @param searchEntry used to control the search bar component
 * @param setSearchEntry used in tandam with searchEntry
 * @param styling can be used to overwrite background colour on specific pages
 * @returns <header> component with standard navigation and children
 */
export default function Header({
    children,
    searchEntry,
    setSearchEntry,
    styling = { backgroundColor: "#6272a4" },
}: {
    styling?: CSSProperties;
    children?: React.ReactNode;
    searchEntry?: string;
    setSearchEntry?: Dispatch<SetStateAction<string>>;
}): React.ReactNode {
    return (
        <header style={{ padding: "1rem 0", ...styling }}>
            <div style={bannerStyle}>
                <Link href="/home" style={{ all: "unset" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            ...bannerItemStyle,
                        }}
                    >
                        <p
                            style={{
                                textWrap: "nowrap",
                                cursor: "pointer",
                                margin: "0",
                            }}
                        >
                            Improved spotify playlists
                        </p>
                    </div>
                </Link>
                {typeof searchEntry != "undefined" &&
                typeof setSearchEntry != "undefined" ? (
                    <SearchBar
                        entry={searchEntry}
                        setEntry={setSearchEntry}
                        style={{ flex: 1, ...bannerItemStyle }}
                    />
                ) : null}
                {Children.map(children, (Child) => {
                    const styleProp: { style: object } = {
                        style: bannerItemStyle,
                    };
                    if (React.isValidElement(Child)) {
                        return React.cloneElement(Child, styleProp);
                    }
                    return Child;
                })}
            </div>
        </header>
    );
}
