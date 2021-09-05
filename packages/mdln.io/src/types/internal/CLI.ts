import * as minimist from "minimist";
import { readFileSync } from "fs";
import { Node } from "mdln";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

enum Name {
  CERT = "cert",
  KEY = "key",
  IO = "io",
  NODES = "nodes",
  HOST = "host",
  PORT = "port",
}

enum Syntax {
  CERT = "--cert <path>",
  KEY = "--key <path>",
  IO = "--io <path>",
  NODES = "--nodes <path>",
  HOST = "--host <host>",
  PORT = "--port <port>",
}

enum Description {
  CERT = "HTTPS certificate file <path>",
  KEY = "HTTPS certificate key file <path>",
  IO = "IO static <path>",
  NODES = "Nodes static <path>",
  HOST = "Web server <host>",
  PORT = "Web server <port>",
}

/**
 * Command line interface node
 */
class CLI extends Node {
  #version: string;
  #host: string;
  #port: string;
  #cert: string;
  #key: string;
  #io: string;
  #nodes: string;

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
        string: [
            Name.CERT,
            Name.KEY,
            Name.IO,
            Name.NODES,
            Name.HOST,
            Name.PORT,
        ],
        unknown: (arg: string) => {
            throw new TypeError(`Unknown CLI option: ${arg}`);
        },
    });
    this.#version = pkg.version;
    this.#cert = (args[Name.CERT] as string) || resolveIoPath("cert/cert.pem");
    this.#key = (args[Name.KEY] as string) || resolveIoPath("cert/key.pem");
    this.#io = (args[Name.IO] as string) || resolveIoPath();
    this.#nodes = (args[Name.NODES] as string) || resolveIoPath();
    this.#host = (args[Name.HOST] as string) || "localhost";
    this.#port = (args[Name.PORT] as string) || "8888";
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
}

export default CLI;
