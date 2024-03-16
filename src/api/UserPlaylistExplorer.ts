/*
Exports the UserPlaylistExplorer
 - use .getPlaylists to get a promise containing an array of Playlist
 - use nextPage and hasNextPage to expand the list
*/

import fetch from "@api/fetch";

/** Class representing the authenticated user's playlist api */
class UserPlaylistExplorer {
  private pages: NonEmptyArray<Promise<UserPlaylist>>;

  /**
   * Get the first page
   */
  constructor() {
    this.pages = [getCurrentUserPlaylist()];
  }

  getPlaylists(): Promise<Playlist[]> {
    return Promise.all(this.pages).then((pages) =>
      pages.flatMap((page) => page.items),
    );
  }

  nextPage(): Promise<void> {
    const shortenURL: (url: string) => string = (url) =>
      url.split("https://api.spotify.com/v1/")[1];
    return new Promise((resolvePageAdd) => {
      this.hasNextPage().then((hasPage) => {
        if (!hasPage) throw new Error("No next page");
        else
          this.getLastPage()
            .then((lastPage) =>
              this.pages.push(
                fetch(shortenURL(lastPage.next!), { method: "GET" }),
              ),
            )
            .then(() => resolvePageAdd());
      });
    });
  }

  hasNextPage(): Promise<boolean> {
    return this.getLastPage().then((page) => page.next != null);
  }

  getLastPage(): Promise<UserPlaylist> {
    // the constructor initates pages with an item and
    // typescript does not have knowledge of index specific types
    return this.pages.at(-1)!;
  }
}
async function getCurrentUserPlaylist(): Promise<UserPlaylist> {
  return await fetch("me/playlists?limit=1", { method: "GET" });
}

export default UserPlaylistExplorer;
