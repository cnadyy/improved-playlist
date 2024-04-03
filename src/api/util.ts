/**
 * @author atmin (stackoverflow)
 * @param x object x
 * @param y object y
 * @returns if they have the same content
 */
export function deepEqual(x: object, y: object): boolean {
    return x && y && typeof x === "object" && typeof y === "object"
        ? Object.keys(x).length === Object.keys(y).length &&
              Object.keys(x).reduce(function (isEqual, key) {
                  //@ts-expect-error nothing can know the types here
                  return isEqual && deepEqual(x[key], y[key]);
              }, true)
        : x === y;
}
