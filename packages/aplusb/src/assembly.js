const fs = require("fs");
const path = require("path");
const loader = require("@assemblyscript/loader");
const wasm = loader.instantiateSync(
  fs.readFileSync(path.resolve(__dirname, "../../wasm/optimized.wasm")),
  {},
);
export default wasm.exports;
