import { stdout } from "process";
import * as minimist from "minimist";
import { readFileSync } from "fs";
import * as colors from "colors";
import { Node } from "mdln";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

const Name = {
  HELP: "help",
  CERT: "cert",
  KEY: "key",
  IO: "io",
  NODES: "nodes",
  HOST: "host",
  PORT: "port",
};

const Syntax = {
  HELP: "--help",
  CERT: "--cert <path>",
  KEY: "--key <path>",
  IO: "--io <path>",
  NODES: "--nodes <path>",
  HOST: "--host <host>",
  PORT: "--port <port>",
};

const Description = {
  HELP: "display this message",
  CERT: "HTTPS certificate file <path>",
  KEY: "HTTPS certificate key file <path>",
  IO: "IO static <path>",
  NODES: "Nodes static <path>",
  HOST: "Web server <host>",
  PORT: "Web server <port>",
};

/**
 * Command line interface node
 */
class CLI extends Node {
  #version = "n/a";
  #host = "n/a";
  #port = "n/a";
  #cert = "n/a";
  #key = "n/a";
  #io = "n/a";
  #nodes = "n/a";

  /**
   * CLI constructor
   * @param argv CLI call arguments array
   */
  constructor(argv?: Array<string>) {
    super();
    const pth = resolveIoPath("./package.json");
    const cnt = readFileSync(pth).toString();
    const pkg = JSON.parse(cnt) as { version: string };
    const args = minimist(argv || [], {
      boolean: [Name.HELP],
      string: [Name.CERT, Name.KEY, Name.IO, Name.NODES, Name.HOST, Name.PORT],
      unknown: (arg: string) => {
        throw new TypeError(`Unknown CLI option: ${arg}`);
      },
    });
    if (args[Name.HELP]) {
      this.help();
    } else {
      this.#version = pkg.version;
      this.#cert =
        (args[Name.CERT] as string) || resolveIoPath("cert/cert.pem");
      this.#key = (args[Name.KEY] as string) || resolveIoPath("cert/key.pem");
      this.#io = (args[Name.IO] as string) || resolveIoPath();
      this.#nodes = (args[Name.NODES] as string) || resolveIoPath();
      this.#host = (args[Name.HOST] as string) || "localhost";
      this.#port = (args[Name.PORT] as string) || "8888";
    }
  }

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
   * Returns CLI help message.
   */
  public help(): void {
    let message = `\n${colors.blue("Usage:")} ${colors.green(
      "mdln.io [options]",
    )}\n\n`;
    message += `${colors.blue("where")} ${colors.green(
      "[options]",
    )} ${colors.blue("are:")}\n\n`;
    message += `\t${colors.green(Syntax.HELP)}\t\t${colors.blue(
      Description.HELP,
    )}\n`;
    message += `\t${colors.green(Syntax.CERT)}\t${colors.blue(
      Description.CERT,
    )}\n`;
    message += `\t${colors.green(Syntax.KEY)}\t${colors.blue(
      Description.KEY,
    )}\n`;
    message += `\t${colors.green(Syntax.IO)}\t${colors.blue(Description.IO)}\n`;
    message += `\t${colors.green(Syntax.NODES)}\t${colors.blue(
      Description.NODES,
    )}\n`;
    message += `\t${colors.green(Syntax.HOST)}\t${colors.blue(
      Description.HOST,
    )}\n`;
    message += `\t${colors.green(Syntax.PORT)}\t${colors.blue(
      Description.PORT,
    )}\n\n`;
    stdout.write(message);
  }
}

export default CLI;
