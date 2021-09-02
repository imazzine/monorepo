import * as regular_import from "./index";

describe("mdln.io exports", () => {
  test("the regular export object is defined", () => {
    expect(regular_import).toBeDefined();
  });
});
