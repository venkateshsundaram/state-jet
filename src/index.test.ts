import { describe, it, expect } from "vitest";
import { VERSION, useStateGlobal } from "./index";

describe("index exports", () => {
  it("should export VERSION and other public APIs", () => {
    expect(VERSION).toBe("2.4.0");
    expect(useStateGlobal).toBeDefined();
  });
});
