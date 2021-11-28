import { stdout, stderr } from "process";
import * as minimist from "minimist";
import { statSync, readFileSync } from "fs";
import { Node } from "@imazzine/mln";
import { intl, messages } from "../../intl";
import Errors from "../../enums/Errors";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

const pth = resolveIoPath("./package.json");
const cnt = readFileSync(pth).toString();
const pkg = JSON.parse(cnt) as { version: string };

const IP_regex =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
const HOST_regex =
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
const PORT_regex =
  /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;

/**
 * CLI commands list.
 */
enum Name {
  HELP = "help",
  VERSION = "version",
  CERT = "cert",
  KEY = "key",
  IO = "io",
  NODES = "nodes",
  HOST = "host",
  PORT = "port",
}

/**
 * Command Line Interface node.
 */
class CLI extends Node {
  #_version = pkg.version;
  #_host = "n/a";
  #_port = NaN;
  #_cert = "n/a";
  #_key = "n/a";
  #_io = "n/a";
  #_nodes = "n/a";

  /**
   * mln.io version. Equal to the package.json.version field value.
   */
  get version(): string {
    return this.#_version;
  }

  /**
   * HTTPS certificate file path
   */
  get cert(): string {
    return this.#_cert;
  }

  /**
   * HTTPS certificate key file path
   */
  get key(): string {
    return this.#_key;
  }

  /**
   * Web server host
   */
  get host(): string {
    return this.#_host;
  }

  /**
   * Web server port
   */
  get port(): number {
    return this.#_port;
  }

  /**
   * IO static path
   */
  get io(): string {
    return this.#_io;
  }

  /**
   * Nodes static path
   */
  get nodes(): string {
    return this.#_nodes;
  }

  /**
   * Write error message to the stderr and exit with error code 1.
   */
  private _error(code: Errors, err: string): void {
    stderr.write(err);
    process.exit(code);
  }

  /**
   * Returns CLI help message.
   */
  private _help(): void {
    stdout.write(intl.formatMessage(messages.CLI_HELP));
    process.exit(0);
  }

  /**
   * Returns CLI version info.
   */
  private _version(): void {
    stdout.write(
      intl.formatMessage(messages.CLI_VERSION, {
        version: this.version,
      }),
    );
    process.exit(0);
  }

  /**
   * Determines, whether the required path was specified or not.
   */
  private _checkPath(value?: string): undefined | string {
    if (typeof value === "string") {
      if (value.length === 0) {
        this._error(
          Errors.CLI_ERR_REQ_PATH_MISSED,
          intl.formatMessage(messages.CLI_ERR_REQ_PATH_MISSED),
        );
      } else {
        return value;
      }
    }
    return;
  }

  /**
   * Determines, whether the requested file could be resolved or not.
   */
  private _checkFile(p: string): string {
    let exist = false;
    try {
      exist = statSync(p).isFile();
    } catch (err) {
      exist = false;
    }
    if (!exist) {
      this._error(
        Errors.CLI_ERR_FILE_NOT_FOUND,
        intl.formatMessage(messages.CLI_ERR_FILE_NOT_FOUND, {
          file: p,
        }),
      );
    }
    return p;
  }

  /**
   * Determines, whether passed parameter is a valid hostname or not.
   */
  private _checkHost(h: string): string {
    if (!IP_regex.test(h) && !HOST_regex.test(h)) {
      this._error(
        Errors.CLI_ERR_INVALID_HOST_VALUE,
        intl.formatMessage(messages.CLI_ERR_INVALID_HOST_VALUE, {
          host: h,
        }),
      );
    }
    return h;
  }

  /**
   * Determines, whether passed parameter is a valid port or not.
   */
  private _checkPort(p: string): string {
    if (!PORT_regex.test(p)) {
      this._error(
        Errors.CLI_ERR_INVALID_PORT_VALUE,
        intl.formatMessage(messages.CLI_ERR_INVALID_PORT_VALUE, {
          port: p,
        }),
      );
    }
    return p;
  }

  /**
   * Processing of the cert property.
   */
  private _parseCert(pth?: string): void {
    pth = this._checkPath(pth);
    pth = this._checkFile(pth || resolveIoPath("cert/cert.pem"));
    this.#_cert = pth;
  }

  /**
   * Processing of the key property.
   */
  private _parseKey(pth?: string): void {
    pth = this._checkPath(pth);
    pth = this._checkFile(pth || resolveIoPath("cert/key.pem"));
    this.#_key = pth;
  }

  /**
   * Processing of the host property.
   */
  private _parseHost(host?: string): void {
    if (typeof host === "string" && host.length === 0) {
      this._error(
        Errors.CLI_ERR_REQ_HOST_MISSED,
        intl.formatMessage(messages.CLI_ERR_REQ_HOST_MISSED),
      );
    }
    this.#_host = this._checkHost(host || "localhost");
  }

  /**
   * Processing of the port property.
   */
  private _parsePort(port?: string): void {
    if (typeof port === "string" && port.length === 0) {
      this._error(
        Errors.CLI_ERR_REQ_PORT_MISSED,
        intl.formatMessage(messages.CLI_ERR_REQ_PORT_MISSED),
      );
    }
    this.#_port = parseInt(this._checkPort(port || "8888"));
  }

  /**
   * CLI constructor.
   * @param CLI_options Options array (argv formatted)
   */
  constructor(CLI_options?: Array<string>) {
    super();
    const args = minimist(CLI_options || [], {
      boolean: [Name.HELP, Name.VERSION],
      string: [Name.CERT, Name.KEY, Name.IO, Name.NODES, Name.HOST, Name.PORT],
      unknown: ((arg: string) => {
        this._error(
          Errors.CLI_ERR_UNKNOWN_OPTION,
          intl.formatMessage(messages.CLI_ERR_UNKNOWN_OPTION, {
            option: arg,
          }),
        );
      }) as (arg: string) => boolean,
    });
    if (args[Name.HELP]) {
      this._help();
    } else if (args[Name.VERSION]) {
      this._version();
    } else {
      this._parseHost(args[Name.HOST]);
      this._parsePort(args[Name.PORT]);
      this._parseCert(args[Name.CERT]);
      this._parseKey(args[Name.KEY]);
      this.#_io = (args[Name.IO] as string) || resolveIoPath();
      this.#_nodes = (args[Name.NODES] as string) || resolveIoPath();
    }
  }
}

export default CLI;
