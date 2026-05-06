import { describe, it, expect } from "vitest";
import { normalizeKpIndex } from "../normalizeKpIndex.js";

describe("normalizeKpIndex", () => {
  it("parses a valid NOAA Kp row", () => {
    const row = ["2025-03-16 15:00:00.000", "4.00", "observed"];
    const result = normalizeKpIndex(row);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("kp_index");
    expect(result.source).toBe("NOAA_SWPC");
    expect(result.value.kp).toBe(4.0);
    expect(result.value.status).toBe("observed");
    expect(result.unit).toBe("Kp");
  });

  it("classifies Kp 0 as quiet", () => {
    const row = ["2025-03-16 00:00:00.000", "0.00", "observed"];
    const result = normalizeKpIndex(row);
    expect(result.value.level).toBe("quiet");
  });

  it("classifies Kp 5 as minor", () => {
    const row = ["2025-03-16 06:00:00.000", "5.00", "observed"];
    const result = normalizeKpIndex(row);
    expect(result.value.level).toBe("minor");
  });

  it("returns error for non-array input", () => {
    const result = normalizeKpIndex("bad");
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("returns error for short array", () => {
    const result = normalizeKpIndex(["2025-03-16"]);
    expect(result.error).toBeTruthy();
  });

  it("returns error for NaN Kp value", () => {
    const result = normalizeKpIndex(["2025-03-16 15:00:00.000", "not-a-number"]);
    expect(result.error).toBeTruthy();
  });
});
