#!/usr/bin/env node

/**
 * @fileoverview mdln.io CLI executable.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { CLI } from "./lib/cjs/index";
new CLI(process.argv.slice(2));