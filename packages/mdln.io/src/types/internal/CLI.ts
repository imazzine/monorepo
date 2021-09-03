import { Node } from "mdln";
import { Command } from "commander";
import { readFileSync } from "fs";
import resolveIoPath from "../../helpers/paths/resolveIoPath";

/**
 * Command line interface node
 */
class CLI extends Node {
  #host = "localhost";
  #port = "8888";
  #cert: string = resolveIoPath("cert/cert.pem");
  #key: string = resolveIoPath("cert/key.pem");
  #io: string = resolveIoPath();
  #nodes: string = resolveIoPath();
  #program: Command = new Command();

  /**
   * CLI constructor
   * @param a CLI call arguments array
   */
  constructor(a?: Array<string>) {
    super();
    const pth = resolveIoPath("./package.json");
    const cnt = readFileSync(pth).toString();
    const pkg = JSON.parse(cnt) as { version: string };
    this.#program
      .version(pkg.version)
      .option("--cert <path>", "HTTPS certificate file <path>", this.#cert)
      .option("--key <path>", "HTTPS certificate key file <path>", this.#key)
      .option("--io <path>", "IO static <path>", this.#io)
      .option("--nodes <path>", "Nodes static <path>", this.#nodes)
      .option("--host <host>", "Web server <host>", this.#host)
      .option("--port <port>", "Web server <port>", this.#port)
      .parse(a);
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
