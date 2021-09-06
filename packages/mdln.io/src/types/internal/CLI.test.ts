import { jest } from "@jest/globals";
import * as process from "process";
import { stdout, stderr } from "process";
import { readFileSync } from "fs";
import * as regular_import from "./CLI";
import CLI from "./CLI";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

const pth = resolveIoPath("./package.json");
const cnt = readFileSync(pth).toString();
const pkg = JSON.parse(cnt) as { version: string };
let cli: CLI;
let spyExit: jest.SpyInstance<never, [code?: number | undefined]>;
let spyWrite: jest.SpyInstance<
  boolean,
  [
    str: string | Uint8Array,
    encoding?: BufferEncoding | undefined,
    cb?: ((err?: Error | undefined) => void) | undefined,
  ]
>;
let spyError: jest.SpyInstance<
  boolean,
  [
    str: string | Uint8Array,
    encoding?: BufferEncoding | undefined,
    cb?: ((err?: Error | undefined) => void) | undefined,
  ]
>;

describe("CLI", () => {
  beforeAll(() => {
    spyExit = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("exit 1");
    }) as jest.SpyInstance<never, [code?: number | undefined]>;
  });

  afterAll(() => {
    spyExit.mockRestore();
  });

  beforeEach(() => {
    spyWrite = jest.spyOn(stdout, "write").mockImplementation(() => {
      return true;
    }) as jest.SpyInstance<
      boolean,
      [
        str: string | Uint8Array,
        encoding?: BufferEncoding | undefined,
        cb?: ((err?: Error | undefined) => void) | undefined,
      ]
    >;
    spyError = jest.spyOn(stderr, "write").mockImplementation(() => {
      return true;
    }) as jest.SpyInstance<
      boolean,
      [
        str: string | Uint8Array,
        encoding?: BufferEncoding | undefined,
        cb?: ((err?: Error | undefined) => void) | undefined,
      ]
    >;
  });

  afterEach(() => {
    spyWrite.mockRestore();
    spyError.mockRestore();
  });

  test("export is valid", () => {
    expect(regular_import).toBeDefined();
    expect(regular_import.default).toBeDefined();
    expect(CLI).toBeDefined();
    expect(CLI).toEqual(regular_import.default);
  });

  test("unknown options are throw", () => {
    expect(() => {
      cli = new CLI(["--throw", "throw"]);
    }).toThrow("exit 1");
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  test("--help returns a message", () => {
    expect(() => {
      cli = new CLI(["--help"]);
    }).not.toThrow();
    expect(spyWrite).toHaveBeenCalled();
    expect(spyError).not.toHaveBeenCalled();
  });

  test("no parameters are required", () => {
    expect(() => {
      cli = new CLI();
    }).not.toThrow();
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).not.toHaveBeenCalled();
  });

  test("default values are valid", () => {
    expect(cli.version).toEqual(pkg.version);
    expect(cli.cert).toEqual(
      readFileSync(resolveIoPath("cert/cert.pem")).toString(),
    );
    expect(cli.key).toEqual(resolveIoPath("cert/key.pem"));
    expect(cli.io).toEqual(resolveIoPath());
    expect(cli.nodes).toEqual(resolveIoPath());
    expect(cli.host).toEqual("localhost");
    expect(cli.port).toEqual("8888");
  });

  test("node could be disposed", () => {
    expect(() => {
      cli.dispose();
    }).not.toThrow();
    expect(cli.disposed).toBeTruthy();
    expect(cli.disposed).toBeLessThanOrEqual(Date.now());
  });

  test("throws if --cert <path> is missed", () => {
    expect(() => {
      cli = new CLI(["--cert"]);
    }).toThrow("exit 1");
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  test("throws if --cert <path> is a folder identifier", () => {
    expect(() => {
      cli = new CLI(["--cert", "/"]);
    }).toThrow("exit 1");
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  test("throws if --cert <path> is not an existing file identifier", () => {
    expect(() => {
      cli = new CLI(["--cert", "/cert.pem"]);
    }).toThrow("exit 1");
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).toHaveBeenCalled();
  });

  test("works if --cert <path> is an existing file identifier", () => {
    expect(() => {
      cli = new CLI(["--cert", resolveIoPath("./cert/cert.pem")]);
    }).not.toThrow();
    expect(spyWrite).not.toHaveBeenCalled();
    expect(spyError).not.toHaveBeenCalled();
    expect(cli.version).toEqual(pkg.version);
    expect(cli.cert).toEqual(
      readFileSync(resolveIoPath("cert/cert.pem")).toString(),
    );
    expect(() => {
      cli.dispose();
    }).not.toThrow();
  });
});
