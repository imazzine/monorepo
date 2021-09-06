import * as regular_import from "./index";
import CLI from "./types/internal/CLI";
describe("mdln.io exports", () => {
  test("the regular export object is defined", () => {
    expect(regular_import).toBeDefined();
    expect(regular_import.CLI).toEqual(CLI);
  });
});
