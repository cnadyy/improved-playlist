import Folder, { SubitemKind } from "@/api/types/Folder";
import {
  faAngleDown,
  faAngleRight,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// This only renders subitems,
// it is not responseible for rendering the original folder.
function FolderExporer({
  folders,
  rootId,
  onDropdownClick,
}: {
  folders: Folder[];
  rootId: number;
  onDropdownClick: (itemID: number) => void;
}) {
  function drawFolder(folder: Folder) {
    return (
      <>
        <ul style={{ listStyleType: "none" }}>
          {folder.items.map((item) => {
            if (item.kind == SubitemKind.Folder) {
              // Basically guarentee this, hope there is a way
              // for this to make sense in typescript
              const subfolder = folders[item.itemID as number];
              const subitems = subfolder.open && drawFolder(subfolder);
              const openIcon = subfolder.open ? (
                <FontAwesomeIcon
                  style={{ paddingRight: 10 }}
                  color="gray"
                  icon={faAngleDown}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ paddingLeft: 2, paddingRight: 12 }}
                  color="gray"
                  icon={faAngleRight}
                />
              );
              return (
                <li key={subfolder.id}>
                  <a onClick={() => onDropdownClick(item.itemID as number)}>
                    {openIcon}
                    <FontAwesomeIcon icon={faFolder} color="gray" />{" "}
                    {subfolder.name}
                  </a>
                  {subitems}
                </li>
              );
            } else {
              return <li key={item.kind}>{item.itemID}</li>;
            }
          })}
        </ul>
      </>
    );
  }

  return drawFolder(folders[rootId]);
}

export default FolderExporer;
