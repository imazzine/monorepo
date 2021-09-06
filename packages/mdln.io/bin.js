#!/usr/bin/env node

/**
 * @fileoverview mdln.io CLI executable.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

const CLI = require("./lib/cjs/index").CLI;
new CLI(process.argv.slice(2));