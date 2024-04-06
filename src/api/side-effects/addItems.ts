import getFolder from "@/api/firebase/get/folder";
import setFolder from "@/api/firebase/set/folder";
import { SubitemKind } from "@/api/types/Folder";

export default async function addItems(
    folderID: FolderId,
    additional: { folders: FolderId[]; playlists: PlaylistId[] },
): Promise<void> {
    // add items to a fresh fetch of the folder
    const f = await getFolder(folderID);

    console.log(additional);

    f.items = [
        ...f.items,
        ...additional.folders.map((f) => ({
            kind: SubitemKind.Folder,
            itemID: f,
        })),
        ...additional.playlists.map((p) => ({
            kind: SubitemKind.SpotifyURI,
            itemID: "spotify:playlist:" + p,
        })),
    ];

    console.log(f);

    return setFolder(f);
}
