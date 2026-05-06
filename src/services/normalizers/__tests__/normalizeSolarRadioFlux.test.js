import { describe, it, expect } from "vitest";
import {
  normalizeSolarRadioFlux,
  normalizeSolarRadioFluxArray,
} from "../normalizeSolarRadioFlux.js";

const fluxItem = {
  time_tag: "2026-05-06T17:00:00",
  frequency: 2800,
  flux: 122,
  reporting_schedule: "Morning",
};

describe("normalizeSolarRadioFlux", () => {
  it("normalizes a valid item", () => {
    const result = normalizeSolarRadioFlux(fluxItem);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("solar_radio_flux");
    expect(result.source).toBe("NOAA_SWPC");
    expect(result.value.flux_sfu).toBe(122);
    expect(result.value.activityLevel).toBe("moderate");
  });

  it("returns an error signal for unknown shape", () => {
    const result = normalizeSolarRadioFlux({ unexpected: true });
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeSolarRadioFluxArray([])).toEqual([]);
  });
});
