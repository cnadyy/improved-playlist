import { CSSProperties, Dispatch, SetStateAction } from "react";

const searchBarStyle: CSSProperties = {
  border: "none",
  borderRadius: "20px",
  backgroundColor: "#cfcfcf",
  padding: "0px 1.5rem",
};

/**
 *
 * @param searchEntry: Search term typed by user
 * @returns automatically sized search bar
 */
export default function SearchBar({
  entry,
  setEntry,
  style = {},
}: {
  setEntry: Dispatch<SetStateAction<string>>;
  entry: string;
  style?: CSSProperties;
}) {
  return (
    <input
      autoFocus
      style={{ ...searchBarStyle, ...style }}
      type="text"
      name="search"
      placeholder="Search"
      value={entry}
      onChange={(e) => setEntry(e.target.value)}
    />
  );
}
