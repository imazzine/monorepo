import { jest } from "@jest/globals";
import * as process from "process";
import { readFileSync } from "fs";
import { Logger, LogLevel, setLogger, setLevel } from "mdln";
import * as regular_import from "./CLI";
import CLI from "./CLI";
import { intl, messages } from "../../intl";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

const pth = resolveIoPath("./package.json");
const cnt = readFileSync(pth).toString();
const pkg = JSON.parse(cnt) as { version: string };
const logs: Map<LogLevel, { uid: string; message: string }> = new Map();
let spyExit: jest.SpyInstance<never, [code?: number | undefined]>;

class SpyLogger extends Logger {
  $log(level: LogLevel, message: string) {
    logs.set(level, {
      uid: this.uid,
      message: message,
    });
    return true;
  }
}
setLogger(SpyLogger);
setLevel(LogLevel.INFO);

describe("CLI", () => {
  beforeAll(() => {
    spyExit = jest.spyOn(process, "exit").mockImplementation((code) => {
      if (code && typeof code === "number" && code > 0) {
        throw new Error("exit 1");
      }
      throw new Error("exit 0");
    }) as jest.SpyInstance<never, [code?: number | undefined]>;
  });

  afterAll(() => {
    spyExit.mockRestore();
  });

  afterEach(() => {
    logs.delete(LogLevel.ERROR);
    logs.delete(LogLevel.INFO);
  });

  describe("general", () => {
    let cli: CLI;
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
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_unknown_option, {
          option: "--throw",
        }),
      );
    });

    test("--help returns a message", () => {
      expect(() => {
        cli = new CLI(["--help"]);
      }).toThrow("exit 0");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.INFO)?.uid).toBeDefined();
      expect(logs.get(LogLevel.INFO)?.message).toEqual(
        intl.formatMessage(messages.cli_help),
      );
    });

    test("--version returns a message", () => {
      expect(() => {
        cli = new CLI(["--version"]);
      }).toThrow("exit 0");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.INFO)?.uid).toBeDefined();
      expect(logs.get(LogLevel.INFO)?.message).toEqual(
        intl.formatMessage(messages.cli_version, {
          version: pkg.version,
        }),
      );
    });

    test("no parameters are required", () => {
      expect(() => {
        cli = new CLI();
      }).not.toThrow();
      expect(cli).toBeDefined();
      expect(logs.has(LogLevel.INFO)).toBeFalsy();
    });

    test("default values are valid", () => {
      expect(cli.version).toEqual(pkg.version);
      expect(cli.cert).toEqual(resolveIoPath("cert/cert.pem"));
      expect(cli.key).toEqual(resolveIoPath("cert/key.pem"));
      expect(cli.io).toEqual(resolveIoPath());
      expect(cli.nodes).toEqual(resolveIoPath());
      expect(cli.host).toEqual("localhost");
      expect(cli.port).toEqual(8888);
    });

    test("node could be disposed", () => {
      expect(() => {
        cli.dispose();
      }).not.toThrow();
      expect(cli.disposed).toBeTruthy();
      expect(cli.disposed).toBeLessThanOrEqual(Date.now());
    });
  });

  describe("--cert option", () => {
    let cli: CLI;
    test("throws if --cert <path> is missed", () => {
      expect(() => {
        cli = new CLI(["--cert"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_req_path_missed),
      );
    });

    test("throws if --cert <path> is a folder identifier", () => {
      expect(() => {
        cli = new CLI(["--cert", "/"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_file_not_found, {
          file: "/",
        }),
      );
    });

    test("throws if --cert <path> is not an existing file identifier", () => {
      expect(() => {
        cli = new CLI(["--cert", "/cert.pem"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_file_not_found, {
          file: "/cert.pem",
        }),
      );
    });

    test("works if --cert <path> is an existing file identifier", () => {
      expect(() => {
        cli = new CLI(["--cert", resolveIoPath("./cert/cert.pem")]);
      }).not.toThrow();
      expect(logs.has(LogLevel.INFO)).toBeFalsy();
      expect(cli).toBeDefined();
      expect(cli.version).toEqual(pkg.version);
      expect(cli.cert).toEqual(resolveIoPath("cert/cert.pem"));
      expect(() => {
        cli.dispose();
      }).not.toThrow();
    });
  });

  describe("--key option", () => {
    let cli: CLI;
    test("throws if --key <path> is missed", () => {
      expect(() => {
        cli = new CLI(["--key"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_req_path_missed),
      );
    });

    test("throws if --key <path> is a folder identifier", () => {
      expect(() => {
        cli = new CLI(["--key", "/"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_file_not_found, {
          file: "/",
        }),
      );
    });

    test("throws if --key <path> is not an existing file identifier", () => {
      expect(() => {
        cli = new CLI(["--key", "/key.pem"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_file_not_found, {
          file: "/key.pem",
        }),
      );
    });

    test("works if --key <path> is an existing file identifier", () => {
      expect(() => {
        cli = new CLI(["--key", resolveIoPath("./cert/key.pem")]);
      }).not.toThrow();
      expect(cli).toBeDefined();
      expect(logs.has(LogLevel.ERROR)).toBeFalsy();
      expect(logs.get(LogLevel.INFO)).toBeFalsy();
      expect(cli.version).toEqual(pkg.version);
      expect(cli.key).toEqual(resolveIoPath("cert/key.pem"));
      expect(() => {
        cli.dispose();
      }).not.toThrow();
    });
  });

  describe("--host option", () => {
    let cli: CLI;
    test("throws if <host> is missed", () => {
      expect(() => {
        cli = new CLI(["--host"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_req_host_missed),
      );
    });

    test("throws if <host> is a wrong string", () => {
      expect(() => {
        cli = new CLI(["--host", "@!#"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_invalid_host_value, {
          host: "@!#",
        }),
      );
    });

    test("works if <host> is a valid hostname", () => {
      expect(() => {
        cli = new CLI(["--host", "imazzine"]);
      }).not.toThrow();
      expect(cli).toBeDefined();
      expect(logs.has(LogLevel.ERROR)).toBeFalsy();
      expect(logs.has(LogLevel.INFO)).toBeFalsy();
      expect(cli.version).toEqual(pkg.version);
      expect(cli.host).toEqual("imazzine");
      expect(() => {
        cli.dispose();
      }).not.toThrow();
    });

    test("works if <host> is a valid IP", () => {
      expect(() => {
        cli = new CLI(["--host", "0.0.0.0"]);
      }).not.toThrow();
      expect(cli).toBeDefined();
      expect(logs.has(LogLevel.ERROR)).toBeFalsy();
      expect(logs.has(LogLevel.INFO)).toBeFalsy();
      expect(cli.version).toEqual(pkg.version);
      expect(cli.host).toEqual("0.0.0.0");
      expect(() => {
        cli.dispose();
      }).not.toThrow();
    });
  });

  describe("--port option", () => {
    let cli: CLI;
    test("throws if <port> is missed", () => {
      expect(() => {
        cli = new CLI(["--port"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_req_port_missed),
      );
    });

    test("throws if <port> is a string", () => {
      expect(() => {
        cli = new CLI(["--port", "string"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_invalid_port_value, {
          port: "string",
        }),
      );
    });

    test("throws if <port> is a wrong number", () => {
      expect(() => {
        cli = new CLI(["--port", "111111111111"]);
      }).toThrow("exit 1");
      expect(cli).toBeUndefined();
      expect(logs.get(LogLevel.ERROR)?.uid).toBeDefined();
      expect(logs.get(LogLevel.ERROR)?.message).toEqual(
        intl.formatMessage(messages.cli_err_invalid_port_value, {
          port: "111111111111",
        }),
      );
    });

    test("works if <port> is a valid number", () => {
      expect(() => {
        cli = new CLI(["--port", "9999"]);
      }).not.toThrow();
      expect(cli).toBeDefined();
      expect(logs.get(LogLevel.ERROR)).toBeFalsy();
      expect(logs.get(LogLevel.INFO)).toBeFalsy();
      expect(cli.port).toEqual(9999);
      expect(() => {
        cli.dispose();
      }).not.toThrow();
    });
  });
});
