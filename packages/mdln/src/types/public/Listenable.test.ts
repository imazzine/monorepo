import { jest } from "@jest/globals";
import getInternalState from "../../helpers/getInternalState";
import Errors from "../../enums/Errors";
import Monitorable from "./Monitorable";
import Disposable from "./Disposable";
import Event from "./Event";

// Mock dispatchEvent BEFORE it will be imported by the Listenable.
jest.mock("../../helpers/dispatchEvent", () => {
  return {
    __esModule: true,
    default: jest.fn((target: Listenable, type: string, scope?: unknown) => {
      return {
        target: target,
        type: type,
        scope: scope,
      };
    }),
  };
});

import Listenable from "./Listenable";

const internal = getInternalState();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cb1 = (e: Event): void => {
  return;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cb2 = (e: Event): void => {
  return;
};
let l: Listenable;

describe("@imazzine/core Listenable class", () => {
  test("Listenable is a valid constructor", () => {
    expect(() => {
      l = new Listenable();
    }).not.toThrow();
    expect(internal.undisposed.size).toEqual(1);
  });
  test("Listenable instance inheritance is valid", () => {
    expect(l instanceof Listenable).toBeTruthy();
    expect(l instanceof Disposable).toBeTruthy();
    expect(l instanceof Monitorable).toBeTruthy();
  });
  test("Listenable.listen is throw if listeners maps is missed", () => {
    const lm = internal.listenersMaps.get(l);
    if (typeof lm !== "undefined") {
      internal.listenersMaps.delete(l);
      expect(() => {
        l.listen("type1", cb1);
      }).toThrow(Errors.LISTENERS_MAP_MISSED);
      internal.listenersMaps.set(l, lm);
    }
  });
  test("Listenable.listen is valid", () => {
    const maps = internal.listenersMaps.get(l);
    expect(() => {
      l.listen("type1", cb1);
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);
    expect(maps?.get("type1")?.[0].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[0].capture).toBeFalsy();
    expect(maps?.get("type1")?.[0].passive).toBeFalsy();
    expect(maps?.get("type1")?.[0].removed).toBeFalsy();
    expect(maps?.get("type1")?.[0].once).toBeFalsy();

    expect(() => {
      l.listen("type1", cb1, {
        capture: false,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);
    expect(maps?.get("type1")?.[0].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[0].capture).toBeFalsy();
    expect(maps?.get("type1")?.[0].passive).toBeFalsy();
    expect(maps?.get("type1")?.[0].removed).toBeFalsy();
    expect(maps?.get("type1")?.[0].once).toBeFalsy();

    expect(() => {
      l.listen("type1", cb1, {
        passive: true,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);
    expect(maps?.get("type1")?.[0].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[0].capture).toBeFalsy();
    expect(maps?.get("type1")?.[0].passive).toBeTruthy();
    expect(maps?.get("type1")?.[0].removed).toBeFalsy();
    expect(maps?.get("type1")?.[0].once).toBeFalsy();

    expect(() => {
      l.listen("type1", cb1, {
        capture: false,
        passive: false,
        once: false,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);
    expect(maps?.get("type1")?.[0].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[0].capture).toBeFalsy();
    expect(maps?.get("type1")?.[0].passive).toBeFalsy();
    expect(maps?.get("type1")?.[0].removed).toBeFalsy();
    expect(maps?.get("type1")?.[0].once).toBeFalsy();

    expect(() => {
      l.listen("type1", cb1, {
        capture: false,
        passive: true,
        once: true,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);
    expect(maps?.get("type1")?.[0].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[0].capture).toBeFalsy();
    expect(maps?.get("type1")?.[0].passive).toBeTruthy();
    expect(maps?.get("type1")?.[0].removed).toBeFalsy();
    expect(maps?.get("type1")?.[0].once).toBeTruthy();

    expect(() => {
      l.listen("type1", cb1, {
        capture: true,
        passive: true,
        once: true,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(2);
    expect(maps?.get("type1")?.[1].callback).toEqual(cb1);
    expect(maps?.get("type1")?.[1].capture).toBeTruthy();
    expect(maps?.get("type1")?.[1].passive).toBeTruthy();
    expect(maps?.get("type1")?.[1].removed).toBeFalsy();
    expect(maps?.get("type1")?.[1].once).toBeTruthy();

    expect(() => {
      l.listen("type1", cb2, {
        capture: false,
        passive: false,
        once: false,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(3);
    expect(maps?.get("type1")?.[2].callback).toEqual(cb2);
    expect(maps?.get("type1")?.[2].capture).toBeFalsy();
    expect(maps?.get("type1")?.[2].passive).toBeFalsy();
    expect(maps?.get("type1")?.[2].removed).toBeFalsy();
    expect(maps?.get("type1")?.[2].once).toBeFalsy();
  });
  test("Listenable.unlisten is throw if listeners maps is missed", () => {
    const lm = internal.listenersMaps.get(l);
    if (typeof lm !== "undefined") {
      internal.listenersMaps.delete(l);
      expect(() => {
        l.unlisten("type1", cb1);
      }).toThrow(Errors.LISTENERS_MAP_MISSED);
      internal.listenersMaps.set(l, lm);
    }
  });
  test("Listenable.dispatch is valid", () => {
    expect(l.dispatch("test1", { scope: "test" })).toStrictEqual({
      target: l,
      type: "test1",
      scope: { scope: "test" },
    });
  });
  test("Listenable.listen is valid", () => {
    const maps = internal.listenersMaps.get(l);

    expect(() => {
      l.unlisten("type1", cb2);
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(2);

    expect(() => {
      l.unlisten("type1", cb1, {
        capture: true,
      });
    }).not.toThrow();
    expect(maps?.get("type1")?.length).toEqual(1);

    expect(() => {
      l.unlisten("type1", cb1, {
        capture: false,
      });
    }).not.toThrow();
    expect(maps?.get("type1")).toBeUndefined();

    expect(() => {
      l.unlisten("type1", cb1);
    }).not.toThrow();
  });
  test("Listenable.dispose is valid", () => {
    l.dispose();
    expect(internal.undisposed.size).toEqual(0);
    expect(internal.listenersMaps.get(l)).toBeUndefined();
  });
});
