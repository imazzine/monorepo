/**
 * @fileoverview Declare path resolver function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import * as path from "path";
const root = path.resolve(path.dirname(__filename), "./../../../../");

/**
 * Resolve full path to the requested relatively to the IO root path.
 * @param s Path to resolve.
 * @returns Resolved IO path.
 */
function resolveIoPath(s?: string): string {
  return path.resolve(root, s ? (s[0] === "/" ? `.${s}` : s) : "");
}
export default resolveIoPath;
