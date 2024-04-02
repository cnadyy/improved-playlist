import getCachedFolder from "@/api/firebase/get/folder-cached";
import getPlaylist from "@/api/spotify/get/playlist";
import { SubitemKind } from "@/api/types/Folder";
import { useQuery } from "@tanstack/react-query";

async function resolve(id: string, kind: SubitemKind) {
    try {
        if (kind == SubitemKind.SpotifyURI) {
            const playlist = await getPlaylist(id);
            return playlist.name;
        } else {
            const folder = await getCachedFolder(id);
            console.log(folder)
            return folder.name;
        }
    } catch (err) {
        console.log(err);
        return "Invalid or private folder/playlist";
    }
}

export default function ItemName({
    id,
    kind,
}: {
    id: string;
    kind: SubitemKind;
}) {
    const item = useQuery({
        queryKey: [kind, id],
        queryFn: () => resolve(id, kind),
        staleTime: 1000 * 60 * 12,
    });

    if (item.isFetching) {
        return <>Loading...</>;
    } else {
        return item.data;
    }
}
