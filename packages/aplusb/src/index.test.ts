/**
 * @fileoverview Package's export test suite definition.
 * @author Artem Lytvynov
 * @copyright Artem Lytvynov
 * @license Apache-2.0
 */

import { performance } from "perf_hooks";
import aplusb from "./index";
describe("a plus b test suite", () => {
  test("default export object is defined", () => {
    expect(aplusb).toBeDefined();
    expect(aplusb.number).toBeDefined();
    expect(typeof aplusb.number).toEqual("function");
    expect(aplusb.bigint).toBeDefined();
    expect(typeof aplusb.bigint).toEqual("function");
  });
  test("10000 loops of 1 + 1", () => {
    const n = 10;
    let start: number;
    let end: number;

    // number
    start = performance.now();
    for (let i = 0; i < n; i++) {
      aplusb.number(i, i);
    }
    end = performance.now();
    console.log(
      `average number(a + b), microseconds: ${(1000 * (end - start)) / n}`,
    );

    // bigint
    start = performance.now();
    for (let i = 0n; i < n; i++) {
      aplusb.bigint(i, i);
    }
    end = performance.now();
    console.log(
      `average bigint(a + b), microseconds: ${(1000 * (end - start)) / n}`,
    );
  });
});
