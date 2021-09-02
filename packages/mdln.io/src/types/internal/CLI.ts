import { Node } from "mdln";

class CLI extends Node {

    /**
     * HTTPS certificate file path. Default - current path.
     */
    cert = ".";

    /**
     * HTTPS certificate key file path. Default - current path.
     */
    key = ".";

    /**
     * Web server host. Default - localhost.
     */
    host = "localhost";

    /**
     * Web server port. Default - 8888.
     */
    port = 8888;

    /**
     * IO library path. Default - current path.
     */
    io = ".";

    /**
     * Nodes libraries path. Default - current path.
     */
    nodes = ".";
}

export default CLI;
