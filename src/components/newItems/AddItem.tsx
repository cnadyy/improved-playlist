/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, {
  CSSProperties,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import SearchBar from "../SearchBar";
import SearchItemList from "./SearchItemList";
import Folder from "@/api/types/Folder";
import getFolderList from "@/api/getFolderList";
import lineClamp from "@/css/LineClamp";
import UserPlaylistExplorer from "@/api/UserPlaylistExplorer";
import HideScrollBar from "@/css/HideScrollBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTrash } from "@fortawesome/free-solid-svg-icons";
import FilterDialog from "./FilterDialog";
import filterOptions from "@/api/types/FilterOptions";
import filterPlaylist from "@/api/search-functions/filterPlaylists";
import filterFolder from "@/api/search-functions/filterFolders";
import UpdateSelectedItems, { SelectedItems } from "./UpdateSelectedItems";

const AddItemStyles: CSSProperties = {
  maxWidth: "750px",
  width: "750px",
  padding: "0",
  height: "75vh",
  overflow: "hidden",
};

const Selected: () => React.ReactNode = () => (
  <div
    style={{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "8rem",
      backgroundColor: "#00000066",
      display: "grid",
      placeItems: "center",
      pointerEvents: "none",
    }}
  >
    <p style={{ color: "white" }}>selected</p>
  </div>
);

const FolderBlock: (
  f: Folder,
  selectedItems: SelectedItems,
  sOnClick: (id: FolderId) => void,
) => React.ReactElement = (f, selectedItems, sOnClick) => (
  <div
    style={{ minWidth: "8rem", maxWidth: "8rem", position: "relative" }}
    key={f.id}
    onClick={() => sOnClick(f.id)}
  >
    <div
      style={{
        width: "8rem",
        aspectRatio: "1/1",
        backgroundColor: f.color,
      }}
    />
    <p style={lineClamp}>{f.name}</p>
    {selectedItems.folders?.includes(f.id) ? <Selected /> : null}
  </div>
);

const PlaylistBlock: (
  p: Playlist,
  selectedItems: SelectedItems,
  sOnClick: (id: PlaylistId) => void,
) => React.ReactNode = (p, selectedItems, sOnClick) => (
  <div
    style={{ minWidth: "8rem", maxWidth: "8rem", position: "relative" }}
    key={p.id}
    onClick={() => sOnClick(p.id)}
  >
    {p.images.length != 0 ? (
      <img src={p.images[0]?.url} style={{ width: "8rem" }} />
    ) : (
      <div
        style={{
          backgroundColor: "grey",
          width: "8rem",
          height: "8rem",
        }}
      />
    )}
    <p style={lineClamp}>{p.name}</p>
    {selectedItems.playlists?.includes(p.id) ? <Selected /> : null}
  </div>
);

/**
 *
 * @param showModal used to indicate if the modal should be open
 * @param closeModal called when the close button is pressed in the modal
 * @note the state of the modal should be externally controlled, with closeModal used to set it to false
 * @returns dialog component that is hidden by default
 */
export default function AddItem({
  showModal,
  closeModal,
}: {
  showModal: boolean;
  closeModal: () => void;
}): React.ReactNode {
  // FIXME: too many useStates
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<filterOptions>(filterOptions.NONE);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [folderList, setFolderList] = useState<Folder[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [controller, setController] = useState<UserPlaylistExplorer | null>(
    null,
  );

  const [selected, dispatchSelected] = useReducer(UpdateSelectedItems, {
    folders: [],
    playlists: [],
  });

  const AwareFBlock: (f: Folder) => React.ReactNode = (f) =>
    FolderBlock(f, selected, (id) =>
      dispatchSelected({ type: "SET_FOLDER", id: id }),
    );
  const AwarePBlock: (p: Playlist) => React.ReactNode = (p) =>
    PlaylistBlock(p, selected, (id) =>
      dispatchSelected({ type: "SET_PLAYLIST", id: id }),
    );

  const FilteredList = () => (
    <div style={{ overflowY: "scroll", ...HideScrollBar, margin: "2rem 0" }}>
      <SearchItemList full>
        {filter == filterOptions.FOLDERS ? (
          folderList.filter((f) => filterFolder(f, query)).map(AwareFBlock)
        ) : filter == filterOptions.PLAYLISTS ? (
          playlists.filter((p) => filterPlaylist(p, query)).map(AwarePBlock)
        ) : filter == filterOptions.PUBLIC ? (
          <p>TODO: Public spotify searching</p>
        ) : (
          <p>No filter selected</p>
        )}
      </SearchItemList>
    </div>
  );

  useEffect(() => {
    if (showModal) ref.current?.showModal();
    else ref.current?.close();
  }, [showModal]);

  // playlist fetching
  useEffect(() => {
    setController(new UserPlaylistExplorer());
  }, []);

  useEffect(() => {
    if (controller) controller.getPlaylists().then(setPlaylists);
  }, [controller]);

  // folder fetching
  useEffect(() => {
    setFolderList(getFolderList());
  }, []);

  return (
    <dialog ref={ref} onCancel={closeModal} style={AddItemStyles}>
      <div
        style={{
          maxHeight: "75vh",
          overflowY: "visible",
          boxSizing: "border-box",
          padding: "1.5rem 2rem 0.1rem",
          display: "flex",
          flexDirection: "column",
          ...HideScrollBar,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            alignItems: "center",
          }}
        >
          <SearchBar
            entry={query}
            setEntry={setQuery}
            style={{ width: "90%", boxSizing: "border-box", height: "2.5rem" }}
          />
          <FontAwesomeIcon
            icon={faFilter}
            style={{
              height: "1.5rem",
              position: "absolute",
              right: "3rem",
              cursor: "pointer",
            }}
            onClick={() => setFiltersOpen(!filtersOpen)}
          />
          <FilterDialog
            showFilters={filtersOpen}
            closeFilters={() => setFiltersOpen(false)}
            filter={filter}
            setFilter={(f) => setFilter(f)}
          />
        </div>
        {filter == filterOptions.NONE ? (
          <div style={{ overflowY: "scroll", ...HideScrollBar }}>
            <SearchItemList
              name="Folders"
              expandList={() => setFilter(filterOptions.FOLDERS)}
            >
              {folderList.map(AwareFBlock)}
            </SearchItemList>
            <SearchItemList
              name="Playlists"
              expandList={() => setFilter(filterOptions.PLAYLISTS)}
            >
              {playlists.map(AwarePBlock)}
            </SearchItemList>
          </div>
        ) : (
          <FilteredList />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          left: "0",
          bottom: "0",
          padding: "0.6rem 1rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row-reverse",
          gap: "1rem",
        }}
      >
        <button
          style={{
            borderRadius: "18px",
            backgroundColor: "#6fb57e",
            color: "#568c66",
            borderStyle: "none",
            fontSize: "1.2rem",
            padding: "0 3rem",
          }}
          onClick={closeModal}
        >
          add
        </button>
        <button
          style={{
            borderRadius: "18px",
            backgroundColor: "#b56f6f",
            color: "#8e5555",
            borderStyle: "none",
            fontSize: "1.2rem",
            padding: "2px 10px",
          }}
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </dialog>
  );
}