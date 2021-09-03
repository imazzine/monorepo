import * as regular_import from "./CLI";
import CLI from "./CLI";

describe("CLI node testsuit", () => {
  test("export is valid", () => {
    expect(regular_import).toBeDefined();
    expect(regular_import.default).toBeDefined();
    expect(CLI).toBeDefined();
    expect(CLI).toEqual(regular_import.default);
  });
  let cli: CLI;
  test("CLI could be instantiated", () => {
    expect(() => {
      cli = new CLI();
    }).not.toThrow();
  });
  test("defaults are valid", () => {
    console.log(__dirname);
    expect(cli.cert).toEqual(__dirname);
  });
});
