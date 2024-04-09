import fetch from "@/api/spotify/fetch";
import { useInfiniteQuery } from "@tanstack/react-query";

function uriToHref(uri: string): string {
    let href = uri.split("https://api.spotify.com/v1/")[1];
    // remove my bogus userid
    href = href.replace("users/[-][-][-]/playlists", "me/playlists");
    return href;
}

export default function useUserPlaylists(): [Playlist[], typeof query] {
    const query = useInfiniteQuery({
        queryKey: ["userPlaylists"],
        queryFn: ({ pageParam: href }) => fetch(href) as Promise<UserPlaylists>,
        getNextPageParam: (lastPage) =>
            lastPage.next ? uriToHref(lastPage.next) : null,
        initialPageParam: "me/playlists?limit=1",
    });

    const playlists = query.data
        ? query.data.pages.flatMap((page) => page.items)
        : [];

    return [playlists, query];
}
