import { Node } from "mdln";
import { Command } from "commander";
import { readFileSync } from "fs";
import * as path from "path";

/**
 * Command line interface node
 */
class CLI extends Node {
  #cert: string;
  #key: string;
  #host: string;
  #port: string;
  #io: string;
  #nodes: string;
  #program: Command = new Command();

  /**
   * CLI constructor
   * @param argv CLI call arguments array
   */
  constructor(argv?: Array<string>) {
    super();
    const pth = path.resolve(__dirname, "../../../../package.json");
    const cnt = readFileSync(pth).toString();
    const pkg = JSON.parse(cnt) as { version: string };
    this.#program
      .version(pkg.version)
      .option("--cert <path>", "HTTPS certificate file <path>", __dirname)
      .option("--key <path>", "HTTPS certificate key file <path>", __dirname)
      .option("--io <path>", "IO static <path>", __dirname)
      .option("--nodes <path>", "Nodes static <path>", __dirname)
      .option("--host <host>", "Web server <host>", "localhost")
      .option("--port <port>", "Web server <port>", "8888")
      .allowUnknownOption()
      .parse(argv);
    this.#cert = this.#program.opts().cert as string;
    this.#key = this.#program.opts().key as string;
    this.#io = this.#program.opts().io as string;
    this.#nodes = this.#program.opts().nodes as string;
    this.#host = this.#program.opts().host as string;
    this.#port = this.#program.opts().port as string;
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