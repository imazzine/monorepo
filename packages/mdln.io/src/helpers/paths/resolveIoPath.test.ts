import { execSync } from "child_process";
import resolveIoPath from "./resolveIoPath";
const root = execSync("npm root")
  .toString()
  .split("\n")[0]
  .split("/node_modules")[0];
describe("helpers/paths/resolveIoPath", () => {
  test("export is valid", () => {
    expect(resolveIoPath).toBeDefined();
    expect(typeof resolveIoPath).toEqual("function");
  });
  test("no parameters", () => {
    expect(resolveIoPath()).toEqual(root);
  });
  test("empty string", () => {
    expect(resolveIoPath("")).toEqual(root);
  });
  test(".", () => {
    expect(resolveIoPath(".")).toEqual(root);
  });
  test("/", () => {
    expect(resolveIoPath("/")).toEqual(root);
  });
  test("./", () => {
    expect(resolveIoPath("./")).toEqual(root);
  });
  test("./.", () => {
    expect(resolveIoPath("./.")).toEqual(root);
  });
  test("//", () => {
    expect(resolveIoPath("//")).toEqual(root);
  });
  test("/cli.js", () => {
    expect(resolveIoPath("/cli.js")).toEqual(`${root}/cli.js`);
  });
  test("/src", () => {
    expect(resolveIoPath("/src")).toEqual(`${root}/src`);
  });
  test("/src/", () => {
    expect(resolveIoPath("/src/")).toEqual(`${root}/src`);
  });
});
