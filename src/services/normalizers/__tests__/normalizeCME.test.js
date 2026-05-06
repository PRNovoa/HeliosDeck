import { describe, expect, it } from "vitest";
import { normalizeCME, normalizeCMEArray } from "../normalizeCME.js";

const rawCME = {
  activityID: "2026-05-04T12:00:00-CME-001",
  catalog: "M2M_CATALOG",
  startTime: "2026-05-04T12:00Z",
  instruments: [{ displayName: "SOHO: LASCO/C2" }],
  cmeAnalyses: [{ speed: 812, type: "C", latitude: 12, longitude: -35 }],
  link: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
};

describe("normalizeCME", () => {
  it("normalizes a DONKI CME event", () => {
    const result = normalizeCME(rawCME);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("coronal_mass_ejections");
    expect(result.value.speed_km_s).toBe(812);
    expect(result.value.activityLevel).toBe("moderate");
  });

  it("returns an error signal for malformed payloads", () => {
    const result = normalizeCME(null);
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("normalizes arrays and filters bad events", () => {
    const result = normalizeCMEArray([rawCME, null]);
    expect(result).toHaveLength(1);
  });
});
