// TODO: Rewrite using reducer

import useUserPlaylists from "@/api/hooks/spotify/useUserPlaylists";

function AuthUserPlaylists() {
    const [playlists, { hasNextPage: hasNext, fetchNextPage: fetchPage }] =
        useUserPlaylists();

    return (
        <ul>
            {playlists.map((playlist) => (
                <li key={playlist.id}>{playlist.name}</li>
            ))}
            {hasNext ? (
                <button onClick={() => fetchPage()}>load more</button>
            ) : null}
        </ul>
    );
}

export default AuthUserPlaylists;
