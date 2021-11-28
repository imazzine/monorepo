#!/usr/bin/env node

/**
 * @fileoverview mln.io CLI executable.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

const CLI = require("./lib/cjs/index").CLI;
const NI = require("./lib/cjs/index").NI;
const cli = new CLI(process.argv.slice(2));
// const ni = new NI(cli);
// ni.addHost("localhost");
// ni.addHost("token.localhost");
// ni.start();
