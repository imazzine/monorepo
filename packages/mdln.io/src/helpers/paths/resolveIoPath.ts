/**
 * @fileoverview Declare path resolver function.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { execSync } from "child_process";
import * as path from "path";
const root = execSync("npm root")
  .toString()
  .split("\n")[0]
  .split("/node_modules")[0];

/**
 * Resolve full path to the requested relatively to the IO root path.
 * @param s Path to resolve.
 * @returns Resolved IO path.
 */
function resolveIoPath(s?: string): string {
  return path.resolve(root, s ? (s[0] === "/" ? `.${s}` : s) : "");
}
export default resolveIoPath;
