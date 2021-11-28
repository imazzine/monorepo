import { Node } from "@imazzine/mln";
import CLI from "../internal/CLI";
import NI from "../internal/NI";

class Hub extends Node {
  get cli(): CLI {
    return this.children[0] as CLI;
  }

  get ni(): NI {
    return this.children[1] as NI;
  }

  constructor() {
    super();
    this.logger.info(JSON.stringify({ instantiated: "Hub" }));

    // ..
    this.insert(new CLI(process.argv.slice(2)));
    // ..

    this.logger.info(JSON.stringify({ constructed: "Hub" }));
  }
}
export default Hub;
