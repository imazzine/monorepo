import { jest } from "@jest/globals";
import { stdout } from "process";
import { readFileSync } from "fs";
import * as colors from "colors";
import * as regular_import from "./CLI";
import CLI from "./CLI";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

describe("CLI node testsuit", () => {
  let cli: CLI;
  const out: (string | Uint8Array)[] = [];
  const pth = resolveIoPath("./package.json");
  const cnt = readFileSync(pth).toString();
  const pkg = JSON.parse(cnt) as { version: string };
  beforeAll(() => {
    const spy = jest.spyOn(stdout, "write");
    spy.mockImplementation(function (v) {
      out.push(v);
      return true;
    });
  });
  test("export is valid", () => {
    expect(regular_import).toBeDefined();
    expect(regular_import.default).toBeDefined();
    expect(CLI).toBeDefined();
    expect(CLI).toEqual(regular_import.default);
  });
  test("CLI should throw if unknown options are passed", () => {
    expect(() => {
      cli = new CLI(["--throw", "throw"]);
    }).toThrow("Unknown CLI option: --throw");
  });
  test("CLI --help option works", () => {
    expect(() => {
      cli = new CLI(["--help"]);
    }).not.toThrow();
    expect(out.length).toEqual(1);
    expect(out[0].length).toBeGreaterThan(0);
  });
  test("CLI without args works", () => {
    expect(() => {
      cli = new CLI();
    }).not.toThrow();
  });
  test("defaults are valid", () => {
    expect(cli.version).toEqual(pkg.version);
    expect(cli.cert).toEqual(resolveIoPath("cert/cert.pem"));
    expect(cli.key).toEqual(resolveIoPath("cert/key.pem"));
    expect(cli.io).toEqual(resolveIoPath());
    expect(cli.nodes).toEqual(resolveIoPath());
    expect(cli.host).toEqual("localhost");
    expect(cli.port).toEqual("8888");
  });
  test("CLI could be disposed", () => {
    expect(() => {
      cli.dispose();
    }).not.toThrow();
    expect(cli.disposed).toBeTruthy();
    expect(cli.disposed).toBeLessThanOrEqual(Date.now());
  });
  test("CLI could be instantiated with args", () => {
    expect(() => {
      cli = new CLI([
        "--cert",
        resolveIoPath("./cert"),
        "--key",
        resolveIoPath("./key"),
        "--io",
        resolveIoPath("./io"),
        "--nodes",
        resolveIoPath("./nodes"),
        "--host",
        "0.0.0.0",
        "--port",
        "7777",
      ]);
    }).not.toThrow();
  });
  test("defaults are valid", () => {
    expect(cli.version).toEqual(pkg.version);
    expect(cli.disposed).toBeFalsy();
    expect(cli.cert).toEqual(resolveIoPath("./cert"));
    expect(cli.key).toEqual(resolveIoPath("./key"));
    expect(cli.io).toEqual(resolveIoPath("./io"));
    expect(cli.nodes).toEqual(resolveIoPath("./nodes"));
    expect(cli.host).toEqual("0.0.0.0");
    expect(cli.port).toEqual("7777");
  });
  test("CLI could be disposed", () => {
    expect(() => {
      cli.dispose();
    }).not.toThrow();
    expect(cli.disposed).toBeTruthy();
    expect(cli.disposed).toBeLessThanOrEqual(Date.now());
  });
});
