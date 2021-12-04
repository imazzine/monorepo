/* eslint-disable */
import { performance } from "perf_hooks";
import { table } from 'table';
import number from "./number";
import bigint from "./bigint";
import assembly from "./assembly.js";
import add from "./add.js";

const i32sum: (a: number, b: number) => number =
  assembly.i32sum as (a: number, b: number) => number;

const i64sum: (a: bigint, b: bigint) => bigint =
  assembly.i64sum as (a: bigint, b: bigint) => bigint;

declare type DataColumn = { [Identifier: number]: Array<number> };
declare type DataTable = {
  number: DataColumn,
  bigint: DataColumn,
  i32sum: DataColumn,
  i64sum: DataColumn,
  add: DataColumn,
};
const data: DataTable = {
  number: {},
  bigint: {},
  i32sum: {},
  i64sum: {},
  add: {},
};

declare type ResultColumn = { [Identifier: number]: number };
declare type ResultTable = {
  number: ResultColumn,
  bigint: ResultColumn,
  i32sum: ResultColumn,
  i64sum: ResultColumn,
  add: ResultColumn,
};
const result: ResultTable = {
  number: {},
  bigint: {},
  i32sum: {},
  i64sum: {},
  add: {},
};

const zeros = 6
const repeats = 100;
for (let t = 0; t <= zeros; t++) {
  const n = Math.pow(10, t);
  let start: number;
  let end: number;
  data.number[n] = [];
  data.bigint[n] = [];
  data.i32sum[n] = [];
  data.i64sum[n] = [];
  data.add[n] = [];
  for (let j = 0; j < repeats; j++) {
    // number
    start = performance.now();
    for (let i = 0; i < n; i++) {
      number(i, i);
    }
    end = performance.now();
    data.number[n].push((1000 * (end - start)) / n);

    // bigint
    start = performance.now();
    for (let i = 0n; i < n; i++) {
      bigint(i, i);
    }
    end = performance.now();
    data.bigint[n].push((1000 * (end - start)) / n);

    // i32sum
    start = performance.now();
    for (let i = 0; i < n; i++) {
      i32sum(i, i);
    }
    end = performance.now();
    data.i32sum[n].push((1000 * (end - start)) / n);

    // i64sum
    start = performance.now();
    for (let i = 0n; i < n; i++) {
      i64sum(i, i);
    }
    end = performance.now();
    data.i64sum[n].push((1000 * (end - start)) / n);

    // add
    start = performance.now();
    for (let i = 0; i < n; i++) {
      add(i, i);
    }
    end = performance.now();
    data.add[n].push((1000 * (end - start)) / n);
  }
}

for (let t = 0; t <= zeros; t++) {
  const n = Math.pow(10, t);
  result.number[n] =
    data.number[n].reduce((p, c) => p + c) /
    data.number[n].length;
  result.bigint[n] =
    data.bigint[n].reduce((p, c) => p + c) /
    data.bigint[n].length;
  result.i32sum[n] =
    data.i32sum[n].reduce((p, c) => p + c) /
    data.i32sum[n].length;
  result.i64sum[n] =
    data.i64sum[n].reduce((p, c) => p + c) /
    data.i64sum[n].length;
  result.add[n] =
    data.add[n].reduce((p, c) => p + c) /
    data.add[n].length;
}

const res = [['cycles', 'number', 'bigint', 'i32sum', 'i64sum', 'add']];
for (let t = 0; t <= zeros; t++) {
  const n = Math.pow(10, t);
  res.push([
    n.toString(),
    result.number[n].toString(),
    result.bigint[n].toString(),
    result.i32sum[n].toString(),
    result.i64sum[n].toString(),
    result.add[n].toString(),
  ]);
}

console.log(table(res));
