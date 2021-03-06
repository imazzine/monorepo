/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @fileoverview Declaration of the getUid function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { v1, v5 } from "uuid";
export namespace helpers {
  const ns = "00000000-0000-0000-0000-000000000000";
  const stringsMap: Map<string, string> = new Map();
  const callbacksMap: Map<(event: unknown) => void, string> = new Map();

  /**
   * Returns random session unique UUID-like string if `value` is not specified.
   * If string or function will be provided as a `value` returns calculated UUID
   * hash of this string/function, persistent for the session.
   *
   * @example
   * ```TypeScript
   * import { getUid } from "mln";
   *
   * console.log(getUid() === getUid());
   * // => false
   *
   * console.log(getUid("string") === getUid("string"));
   * // => true
   *
   * const fn1 = (e)=>{};
   * const fn2 = (e)=>{};
   *
   * console.log(getUid(fn1) === getUid(fn1);
   * // => true
   *
   * console.log(getUid(fn1) === getUid(fn2);
   * // => false
   * ```
   */
  export function getUid(value?: string | ((...args: any) => any)): string {
    if (value) {
      if (typeof value === "string") {
        if (!stringsMap.has(value)) {
          stringsMap.set(value, v5(value, ns).toString());
        }
        return stringsMap.get(value) as string;
      }
      if (typeof value === "function") {
        if (!callbacksMap.has(value)) {
          callbacksMap.set(value, v5(value.toString(), ns).toString());
        }
        return callbacksMap.get(value) as string;
      }
    }
    return v5(v1(), v1()).toString();
  }
}
