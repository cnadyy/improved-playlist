/* eslint @typescript-eslint/no-unused-vars: 0 */
interface Pages<item> {
    next: string | null;
    previous: string | null;
    total: number;
    items: item[];
}

interface PageAble<item> {
    [key: string]: Pages<item>;
}
