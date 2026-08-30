import { describe, expect, it } from "vitest";
import { advance, averageScore } from "./domain";

describe("advance", () => {
  it("does not skip interview", () => {
    expect(advance("applied")).toBe("screen");
    expect(advance("hired")).toBeNull();
  });
});

describe("averageScore", () => {
  it("averages", () => {
    expect(averageScore([4, 5, 3])).toBe(4);
  });
});
