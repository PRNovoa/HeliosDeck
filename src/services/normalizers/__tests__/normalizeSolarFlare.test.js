import { describe, it, expect } from "vitest";
import { normalizeSolarFlare, normalizeSolarFlareArray } from "../normalizeSolarFlare.js";

const validRaw = {
  flrID: "2025-03-16T12:00:00-FLR-001",
  classType: "M2.1",
  beginTime: "2025-03-16T12:00Z",
  peakTime: "2025-03-16T12:45Z",
  endTime: "2025-03-16T13:00Z",
  sourceLocation: "N15W30",
  instruments: [{ displayName: "GOES 16: SXI-" }],
};

describe("normalizeSolarFlare", () => {
  it("parses a valid flare event", () => {
    const result = normalizeSolarFlare(validRaw);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("solar_flare_events");
    expect(result.source).toBe("NASA_DONKI");
    expect(result.value.classType).toBe("M2.1");
    expect(result.value.sourceLocation).toBe("N15W30");
    expect(result.unit).toBe("flare_class");
  });

  it("assigns a numeric severity", () => {
    const result = normalizeSolarFlare(validRaw);
    expect(typeof result.value.severity).toBe("number");
    expect(result.value.severity).toBeGreaterThan(0);
  });

  it("maps instrument displayNames to an array", () => {
    const result = normalizeSolarFlare(validRaw);
    expect(result.value.instruments).toEqual(["GOES 16: SXI-"]);
  });

  it("supports ongoing flares without an end time", () => {
    const result = normalizeSolarFlare({ ...validRaw, endTime: null });
    expect(result.error).toBeNull();
    expect(result.value.endTime).toBeNull();
  });

  it("returns error for null input", () => {
    const result = normalizeSolarFlare(null);
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("returns error for missing classType", () => {
    const result = normalizeSolarFlare({ beginTime: "2025-03-16T12:00Z" });
    expect(result.error).toBeTruthy();
  });
});

describe("normalizeSolarFlareArray", () => {
  it("normalises and sorts by severity descending", () => {
    const rawArray = [
      { ...validRaw, classType: "C1.0", flrID: "c1" },
      { ...validRaw, classType: "X2.0", flrID: "x2" },
      { ...validRaw, classType: "M1.0", flrID: "m1" },
    ];
    const result = normalizeSolarFlareArray(rawArray);
    expect(result[0].value.classType).toBe("X2.0");
    expect(result[1].value.classType).toBe("M1.0");
    expect(result[2].value.classType).toBe("C1.0");
  });

  it("returns empty array for non-array input", () => {
    expect(normalizeSolarFlareArray(null)).toEqual([]);
    expect(normalizeSolarFlareArray("bad")).toEqual([]);
  });

  it("filters out errored normalizations", () => {
    const rawArray = [validRaw, null, { classType: null }];
    const result = normalizeSolarFlareArray(rawArray);
    expect(result.every((s) => s.error === null)).toBe(true);
  });
});
