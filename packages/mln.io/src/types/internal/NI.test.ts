import { jest } from "@jest/globals";
import * as regular_import from "./NI";
describe("NI", () => {
  describe("general", () => {
    test("export is valid", () => {
      expect(regular_import).toBeDefined();
      expect(regular_import.default).toBeDefined();
    });
  });
});
