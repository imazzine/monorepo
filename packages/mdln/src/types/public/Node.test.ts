import getInternalState from "../../helpers/getInternalState";
import Errors from "../../enums/Errors";
import NodeIndex from "../internal/NodeIndex";
import Monitorable from "./Monitorable";
import Disposable from "./Disposable";
import Listenable from "./Listenable";
import Node from "./Node";

const internal = getInternalState();
let n: Node;
let n1: Node;
let n2: Node;
let n3: Node;
let n4: Node;
let n5: Node;

describe("@imazzine/core Node class", () => {
  test("Node is a valid constructor", () => {
    expect(() => {
      n = new Node();
      n1 = new Node();
      n2 = new Node();
      n3 = new Node();
      n4 = new Node();
      n5 = new Node();
    }).not.toThrow();
    expect(internal.nodesIndices.size).toEqual(6);
    expect(internal.nodesIndices.get(n) instanceof NodeIndex).toBeTruthy();
  });
  test("Node instance inheritance is valid", () => {
    expect(n instanceof Listenable).toBeTruthy();
    expect(n instanceof Disposable).toBeTruthy();
    expect(n instanceof Monitorable).toBeTruthy();
    expect(n instanceof Listenable).toBeTruthy();
  });
  test("Node.insert() works as expected", () => {
    internal.nodesIndices.delete(n);
    expect(() => {
      n.insert(n1);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n1.insert(n);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n1.insert(n2, n3);
    }).toThrow(Errors.NODE_MISSED_IN_CHILDREN);

    expect(() => {
      n1.insert(n4);
      n1.insert(n3);
      n1.insert(n4);
      n1.insert(n2, n3);
    }).not.toThrow();
    expect(internal.nodesIndices.get(n1)?.children[0]).toStrictEqual(n2);
    expect(internal.nodesIndices.get(n1)?.children[1]).toStrictEqual(n3);
    expect(internal.nodesIndices.get(n1)?.children[2]).toStrictEqual(n4);
    expect(internal.nodesIndices.get(n2)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n3)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n4)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n2)?.children.length).toEqual(0);
    expect(internal.nodesIndices.get(n3)?.children.length).toEqual(0);
    expect(internal.nodesIndices.get(n4)?.children.length).toEqual(0);
  });
  test("Node.replace() works as expected", () => {
    expect(() => {
      n.replace(n2, n4);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n1.replace(n, n4);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n1.replace(n4, n);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n1.replace(n5, n2);
    }).toThrow(Errors.NODE_MISSED_IN_CHILDREN);

    expect(n1.replace(n2, n5)).toStrictEqual(n2);
    expect(internal.nodesIndices.size).toEqual(5);
    expect(internal.nodesIndices.get(n1)?.children[0]).toStrictEqual(n5);
    expect(internal.nodesIndices.get(n1)?.children[1]).toStrictEqual(n3);
    expect(internal.nodesIndices.get(n1)?.children[2]).toStrictEqual(n4);
    expect(internal.nodesIndices.get(n2)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n3)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n4)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n5)?.parent).toStrictEqual(n1);

    expect(n1.replace(n3, n4)).toStrictEqual(n3);
    expect(internal.nodesIndices.size).toEqual(5);
    expect(internal.nodesIndices.get(n1)?.children[0]).toStrictEqual(n5);
    expect(internal.nodesIndices.get(n1)?.children[1]).toStrictEqual(n4);
    expect(internal.nodesIndices.get(n1)?.children[2]).toBeUndefined();
    expect(internal.nodesIndices.get(n2)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n3)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n4)?.parent).toStrictEqual(n1);
    expect(internal.nodesIndices.get(n5)?.parent).toStrictEqual(n1);
  });
  test("Node.remove() works as expected", () => {
    expect(() => {
      n.remove(n4);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n2.remove(n);
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n2.remove(n3);
    }).toThrow(Errors.NODE_MISSED_IN_CHILDREN);

    expect(n1.remove(n4)).toStrictEqual(n4);
    expect(internal.nodesIndices.size).toEqual(5);
    expect(internal.nodesIndices.get(n1)?.children[0]).toStrictEqual(n5);
    expect(internal.nodesIndices.get(n1)?.children[1]).toBeUndefined();
    expect(internal.nodesIndices.get(n1)?.children[2]).toBeUndefined();
    expect(internal.nodesIndices.get(n2)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n3)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n4)?.parent).toBeUndefined();
    expect(internal.nodesIndices.get(n5)?.parent).toStrictEqual(n1);
  });
  test("Node.dispose() works as expected", () => {
    expect(() => {
      n.dispose();
    }).toThrow(Errors.NODE_INDEX_MISSED);

    expect(() => {
      n2.dispose();
    }).not.toThrow();
    expect(internal.nodesIndices.size).toEqual(4);

    expect(() => {
      n1.dispose();
    }).not.toThrow();
    expect(internal.nodesIndices.size).toEqual(2);

    expect(() => {
      n3.dispose();
      n4.dispose();
    }).not.toThrow();
    expect(internal.nodesIndices.size).toEqual(0);
  });
  test("Node.connected works as expected", () => {
    expect(() => {
      n = new Node();
      n1 = new Node();
      n2 = new Node();
      n3 = new Node();
      n4 = new Node();
      n5 = new Node();
      n1.insert(n2);
      n2.insert(n3);
      n3.insert(n4);
      n3.insert(n5);
    }).not.toThrow();
    expect(n.connected).toBeFalsy();
    expect(n1.connected).toBeTruthy();
    expect(n2.connected).toBeTruthy();
    expect(n3.connected).toBeTruthy();
    expect(n4.connected).toBeTruthy();
    expect(n5.connected).toBeTruthy();
  });
  test("Node.root works as expected", () => {
    expect(n.root).toStrictEqual(n);
    expect(n1.root).toStrictEqual(n1);
    expect(n2.root).toStrictEqual(n1);
    expect(n3.root).toStrictEqual(n1);
    expect(n4.root).toStrictEqual(n1);
    expect(n5.root).toStrictEqual(n1);
  });
  test("Node.parent works as expected", () => {
    expect(n.parent).toBeNull();
    expect(n1.parent).toBeNull();
    expect(n2.parent).toStrictEqual(n1);
    expect(n3.parent).toStrictEqual(n2);
    expect(n4.parent).toStrictEqual(n3);
    expect(n5.parent).toStrictEqual(n3);
  });
  test("Node.next works as expected", () => {
    expect(n.next).toBeNull();
    expect(n1.next).toBeNull();
    expect(n2.next).toBeNull();
    expect(n3.next).toBeNull();
    expect(n4.next).toStrictEqual(n5);
    expect(n5.next).toBeNull();
  });
  test("Node.previous works as expected", () => {
    expect(n.previous).toBeNull();
    expect(n1.previous).toBeNull();
    expect(n2.previous).toBeNull();
    expect(n3.previous).toBeNull();
    expect(n4.previous).toBeNull();
    expect(n5.previous).toStrictEqual(n4);
  });
});
