import { stdout } from "process";
import * as minimist from "minimist";
import { readFileSync } from "fs";
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
      stdout.write(this.help());
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
  public help(): string {
    let result = "Usage: mdln.io [options]\n\n";
    result += "Options:\n";
    result += `\t${Syntax.HELP}\t\t${Description.HELP}\n`;
    result += `\t${Syntax.CERT}\t${Description.CERT}\n`;
    result += `\t${Syntax.KEY}\t${Description.KEY}\n`;
    result += `\t${Syntax.IO}\t${Description.IO}\n`;
    result += `\t${Syntax.NODES}\t${Description.NODES}\n`;
    result += `\t${Syntax.HOST}\t${Description.HOST}\n`;
    result += `\t${Syntax.PORT}\t${Description.PORT}\n`;
    return result;
  }
}

export default CLI;
