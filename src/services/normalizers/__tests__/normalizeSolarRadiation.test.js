import { describe, expect, it } from "vitest";
import {
  normalizeSolarRadiation,
  normalizeSolarRadiationArray,
} from "../normalizeSolarRadiation.js";

const rawRadiation = {
  time_tag: "2026-05-06T15:22:00Z",
  satellite: 18,
  flux: 9.08e-7,
  observed_flux: 9.46e-7,
  energy: "0.1-0.8nm",
};

describe("normalizeSolarRadiation", () => {
  it("normalizes a GOES X-ray flux sample", () => {
    const result = normalizeSolarRadiation(rawRadiation);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("solar_radiation");
    expect(result.value.xrayClass).toBe("B");
    expect(result.value.flux_w_m2).toBe(9.08e-7);
  });

  it("filters arrays to the long GOES XRS channel", () => {
    const result = normalizeSolarRadiationArray([
      { ...rawRadiation, energy: "0.05-0.4nm" },
      rawRadiation,
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].value.energy).toBe("0.1-0.8nm");
  });

  it("returns an error signal for malformed samples", () => {
    const result = normalizeSolarRadiation({});
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });
});
