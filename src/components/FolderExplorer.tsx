import Folder, { SubitemKind } from "@/api/types/Folder";

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
        <ul>
          {folder.items.map((item) => {
            if (item.kind == SubitemKind.Folder) {
              // Basically guarentee this, hope there is a way
              // for this to make sense in typescript
              const subfolder = folders[item.itemID as number];
              const subitems = subfolder.open && drawFolder(subfolder);
              const openIcon = subfolder.open ? "↡" : "↠";
              return (
                <li key={subfolder.id}>
                  <a onClick={() => onDropdownClick(item.itemID as number)}>
                    {openIcon}
                  </a>{" "}
                  📁 {subfolder.name}
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
