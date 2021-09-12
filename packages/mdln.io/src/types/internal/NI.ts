import { Node } from "mdln";
import { SSLApp, TemplatedApp } from "uWebSockets.js";
import * as colors from "colors";
import { stdout, stderr } from "process";

interface NI_options {
  host: string;
  port: number;
  cert: string;
  key: string;
}

/**
 * Network Interface node.
 */
class NI extends Node {
  #_opts: NI_options;
  #_app: TemplatedApp;
  #_hosts: Map<string, TemplatedApp> = new Map();

  /**
   * NI constructor.
   */
  constructor(options: NI_options) {
    super();
    this.#_opts = options;
    this.#_app = SSLApp({
      key_file_name: this.#_opts.key,
      cert_file_name: this.#_opts.cert,
    }).missingServerName((host) => {
      this._error(`not registered host ${colors.bold(host)}`);
    });
  }

  /**
   * Write error message to the stderr and exit with error code 1.
   */
  private _error(err: string): void {
    const message = `\n${colors.red(`Error: ${err}`)}\n\n`;
    stderr.write(message);
    process.exit(1);
  }

  /**
   * Applies router configuration to the specified host.
   */
  protected applyRouterInternal(host: string): void {
    const app = this.#_hosts.get(host);
    if (app) {
      app.get("/*", (res) => {
        res
          .writeStatus("200 OK")
          .writeHeader("Test Header", "Test Value")
          .end("<script>console.log('!!!');</script>");
      });
    }
  }

  /**
   * Adds a new host to deal with.
   */
  public addHost(host: string): void {
    if (!this.#_hosts.has(host)) {
      this.#_hosts.set(
        host,
        this.#_app.addServerName(host, {
          key_file_name: this.#_opts.key,
          cert_file_name: this.#_opts.cert,
        }),
      );
      this.applyRouterInternal(host);
    }
  }

  /**
   * Start listening network activities on the specified port.
   */
  public start(): void {
    this.#_app.listen(this.#_opts.port, (token: unknown) => {
      if (token) {
        stdout.write(
          `Start listening on port ${colors.bold(
            this.#_opts.port as unknown as string,
          )}`,
        );
      } else {
        this._error(`failed to start NI (${colors.bold(token as string)})`);
      }
    });
  }
}
export default NI;
