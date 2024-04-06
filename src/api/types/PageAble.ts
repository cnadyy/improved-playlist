/* eslint @typescript-eslint/no-unused-vars: 0 */
interface Pages {
    next: string | null;
    previous: string | null;
    total: number;
    items: unknown[];
}

interface PageAble {
    [key: string]: Pages;
}
