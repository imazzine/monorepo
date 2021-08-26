import getAncestors from "./getAncestors";
import getInternalState from "./getInternalState";
import Errors from "../enums/Errors";
import Listenable from "../types/public/Listenable";
import Node from "../types/public/Node";

class SubListenable extends Listenable {}
class SubNode extends Node {}

const internal = getInternalState();

const l = new Listenable();
const sl = new SubListenable();
const n = new Node();
const sn = new SubNode();
const sn1 = new SubNode();
const n1 = new Node();
const n2 = new Node();
const n3 = new Node();
const n4 = new Node();
const n5 = new Node();

n1.insert(n2);
n2.insert(n3);
n3.insert(n4);
n3.insert(n5);
n5.insert(sn1);

describe("@imazzine/core getAncestors helper", () => {
  test("getAncestors process Listenable as expected", () => {
    expect(() => {
      getAncestors(l);
    }).not.toThrow();
    expect(getAncestors(l) instanceof Array).toBeTruthy();
    expect(getAncestors(l)).toHaveLength(0);
  });
  test("getAncestors process Listenable subclass as expected", () => {
    expect(() => {
      getAncestors(sl);
    }).not.toThrow();
    expect(getAncestors(sl) instanceof Array).toBeTruthy();
    expect(getAncestors(sl)).toHaveLength(0);
  });
  test("getAncestors process not connected Node as expected", () => {
    expect(() => {
      getAncestors(n);
    }).not.toThrow();
    expect(getAncestors(n) instanceof Array).toBeTruthy();
    expect(getAncestors(n)).toHaveLength(0);
  });
  test("getAncestors process not connected Node subclass as expected", () => {
    expect(() => {
      getAncestors(sn);
    }).not.toThrow();
    expect(getAncestors(sn) instanceof Array).toBeTruthy();
    expect(getAncestors(sn)).toHaveLength(0);
  });
  test("getAncestors process connected Nodes as expected", () => {
    expect(() => {
      getAncestors(n1);
    }).not.toThrow();
    expect(getAncestors(n1) instanceof Array).toBeTruthy();
    expect(getAncestors(n1)).toHaveLength(0);

    expect(() => {
      getAncestors(n2);
    }).not.toThrow();
    expect(getAncestors(n2) instanceof Array).toBeTruthy();
    expect(getAncestors(n2)).toHaveLength(1);
    expect(getAncestors(n2)).toContain(n1);

    expect(() => {
      getAncestors(n3);
    }).not.toThrow();
    expect(getAncestors(n3) instanceof Array).toBeTruthy();
    expect(getAncestors(n3)).toHaveLength(2);
    expect(getAncestors(n2)).toContain(n1);
    expect(getAncestors(n3)).toContain(n2);

    expect(() => {
      getAncestors(n4);
    }).not.toThrow();
    expect(getAncestors(n4) instanceof Array).toBeTruthy();
    expect(getAncestors(n4)).toHaveLength(3);
    expect(getAncestors(n4)).toContain(n1);
    expect(getAncestors(n4)).toContain(n2);
    expect(getAncestors(n4)).toContain(n3);

    expect(() => {
      getAncestors(n5);
    }).not.toThrow();
    expect(getAncestors(n5) instanceof Array).toBeTruthy();
    expect(getAncestors(n5)).toHaveLength(3);
    expect(getAncestors(n5)).toContain(n1);
    expect(getAncestors(n5)).toContain(n2);
    expect(getAncestors(n5)).toContain(n3);

    expect(() => {
      getAncestors(sn1);
    }).not.toThrow();
    expect(getAncestors(sn1) instanceof Array).toBeTruthy();
    expect(getAncestors(sn1)).toHaveLength(4);
    expect(getAncestors(sn1)).toContain(n1);
    expect(getAncestors(sn1)).toContain(n2);
    expect(getAncestors(sn1)).toContain(n3);
    expect(getAncestors(sn1)).toContain(n5);
  });
  test("getAncestors throw as expected", () => {
    internal.nodesIndices.delete(n5);
    expect(() => {
      getAncestors(sn1);
    }).toThrow(Errors.NODE_INDEX_MISSED);
  });
});
