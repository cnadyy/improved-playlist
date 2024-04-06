import fetch from "@api/spotify/fetch";

/**
 * @info to be used with paged spotify endpoints
 * @generic0 is the API response object
 * @generic1 is the item in the returned paged list
 */
export class PageExplorer<Response extends PageAble | Pages, Item> {
    private responses: NonEmptyArray<Promise<Response>>;
    private pointToPages: (api: Response) => Pages;

    /**
     * @param apiRequest apiRequest made to a PageAble endpoint
     * @param pointToPages function returning Pages from this PageAble endpoint
     */
    constructor(
        apiRequest: Promise<Response>,
        pointToPages: (api: Response) => Pages,
    ) {
        this.responses = [apiRequest];
        this.pointToPages = pointToPages;
    }

    getItems(): Promise<Item[]> {
        return Promise.all(this.responses).then((responses) =>
            responses.flatMap((res: Response) => this.pointToPages(res).items),
        ) as Promise<Item[]>;
    }

    nextPage(): Promise<void> {
        const shortenURL: (url: string) => string = (url) =>
            url.split("https://api.spotify.com/v1/")[1];
        return new Promise((resolvePageAdd) =>
            (async () => {
                const nPage = !(await this.hasNextPage());
                if (nPage) throw new Error("No next page");
                else {
                    const lRes = await this.getLastResponse();
                    console.log(lRes);
                    console.log(shortenURL(this.pointToPages(lRes).next!));
                    this.responses.push(
                        fetch(shortenURL(this.pointToPages(lRes).next!), {
                            method: "get",
                        }),
                    );
                    resolvePageAdd();
                }
            })(),
        );
    }

    async hasNextPage(): Promise<boolean> {
        const response = await this.getLastResponse();
        return this.pointToPages(response).next != null;
    }

    getLastResponse(): Promise<Response> {
        return this.responses.at(-1)!;
    }
}
