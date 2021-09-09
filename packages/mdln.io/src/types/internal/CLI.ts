import { stdout, stderr } from "process";
import * as minimist from "minimist";
import { statSync, readFileSync } from "fs";
import * as colors from "colors";
import { Node } from "mdln";
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
 * CLI commands syntaxes list.
 */
enum Syntax {
  HELP = "--help",
  VERSION = "--version",
  CERT = "--cert <path>",
  KEY = "--key <path>",
  IO = "--io <path>",
  NODES = "--nodes <path>",
  HOST = "--host <host>",
  PORT = "--port <port>",
}

/**
 * CLI commands descriptions list.
 */
enum Description {
  HELP = "display this message",
  VERSION = "version information",
  CERT = "HTTPS certificate file absolute <path>",
  KEY = "HTTPS certificate key file absolute <path>",
  IO = "IO static absolute <path>",
  NODES = "Nodes static absolute <path>",
  HOST = "Web server <host>",
  PORT = "Web server <port>",
}

/**
 * CLI node.
 */
class CLI extends Node {
  #version = pkg.version;
  #host = "n/a";
  #port = "n/a";
  #cert = "n/a";
  #key = "n/a";
  #io = "n/a";
  #nodes = "n/a";

  /**
   * mdln.io version. Equal to the package.json.version field value.
   */
  get version(): string {
    return this.#version;
  }

  /**
   * HTTPS certificate file path
   */
  get cert(): string {
    return this.#cert;
  }

  /**
   * HTTPS certificate key file path
   */
  get key(): string {
    return this.#key;
  }

  /**
   * Web server host
   */
  get host(): string {
    return this.#host;
  }

  /**
   * Web server port
   */
  get port(): string {
    return this.#port;
  }

  /**
   * IO static path
   */
  get io(): string {
    return this.#io;
  }

  /**
   * Nodes static path
   */
  get nodes(): string {
    return this.#nodes;
  }

  /**
   * CLI constructor.
   * @param argv CLI call arguments array
   */
  constructor(argv?: Array<string>) {
    super();
    const args = minimist(argv || [], {
      boolean: [Name.HELP, Name.VERSION],
      string: [Name.CERT, Name.KEY, Name.IO, Name.NODES, Name.HOST, Name.PORT],
      unknown: ((arg: string) => {
        this._error(`unknown option ${colors.bold(arg)}`);
      }) as (arg: string) => boolean,
    });
    if (args[Name.HELP]) {
      this._help();
    } else if (args[Name.VERSION]) {
      this._version();
    } else {
      this._host(args[Name.HOST]);
      this._port(args[Name.PORT]);
      this._cert(args[Name.CERT]);
      this._key(args[Name.KEY]);
      this.#io = (args[Name.IO] as string) || resolveIoPath();
      this.#nodes = (args[Name.NODES] as string) || resolveIoPath();
    }
  }

  /**
   * Write error message to the stderr and exit with error code 1.
   */
  private _error(err: string): void {
    let message = `\n${colors.red(`Error: ${err}`)}\n\n`;
    message += colors.white(
      `(try ${colors.bold("mdln.io --help")} to get some help)\n\n`,
    );
    stderr.write(message);
    process.exit(1);
  }

  /**
   * Returns CLI help message.
   */
  private _help(): void {
    let message = `\n${colors.white("Usage:")} ${colors.bold.green(
      "mdln.io [options]",
    )}\n\n`;
    message += `${colors.white("where")} ${colors.bold.green(
      "[options]",
    )} ${colors.white("are:")}\n\n`;
    message += `\t${colors.bold.green(Syntax.HELP)}\t\t${colors.white(
      Description.HELP,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.VERSION)}\t${colors.white(
      Description.VERSION,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.HOST)}\t${colors.white(
      Description.HOST,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.PORT)}\t${colors.white(
      Description.PORT,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.CERT)}\t${colors.white(
      Description.CERT,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.KEY)}\t${colors.white(
      Description.KEY,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.IO)}\t${colors.white(
      Description.IO,
    )}\n`;
    message += `\t${colors.bold.green(Syntax.NODES)}\t${colors.white(
      Description.NODES,
    )}\n\n`;
    stdout.write(message);
  }

  /**
   * Returns CLI version info.
   */
  private _version(): void {
    const message = `\n${colors.bold.white(`${this.version}`)}\n\n`;
    stdout.write(message);
  }

  /**
   * Determines, whether the required path was specified or not.
   */
  private _checkPath(value?: string): undefined | string {
    if (typeof value === "string") {
      if (value.length === 0) {
        this._error(`required ${colors.bold("<path>")} is missing`);
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
      this._error(`file not found on the given path: ${colors.bold(p)}`);
    }
    return p;
  }

  /**
   * Determines, whether passed parameter is a valid hostname or not.
   */
  private _checkHost(h: string): string {
    if (!IP_regex.test(h) && !HOST_regex.test(h)) {
      this._error(
        `host should be a valid RFC1123 hostname or an IPv4, not a given: ${colors.bold(
          h,
        )}`,
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
        `port should be a number between 0 and 65535, not a given: ${colors.bold(
          p,
        )}`,
      );
    }
    return p;
  }

  /**
   * Processing of the cert property.
   */
  private _cert(pth?: string): void {
    pth = this._checkPath(pth);
    pth = this._checkFile(pth || resolveIoPath("cert/cert.pem"));
    this.#cert = readFileSync(pth).toString();
  }

  /**
   * Processing of the key property.
   */
  private _key(pth?: string): void {
    pth = this._checkPath(pth);
    pth = this._checkFile(pth || resolveIoPath("cert/key.pem"));
    this.#key = readFileSync(pth).toString();
  }

  /**
   * Processing of the host property.
   */
  private _host(host?: string): void {
    if (typeof host === "string" && host.length === 0) {
      this._error(`required ${colors.bold("<host>")} is missing`);
    }
    this.#host = this._checkHost(host || "localhost");
  }

  /**
   * Processing of the port property.
   */
  private _port(port?: string): void {
    if (typeof port === "string" && port.length === 0) {
      this._error(`required ${colors.bold("<port>")} is missing`);
    }
    this.#port = this._checkPort(port || "8888");
  }
}

export default CLI;
