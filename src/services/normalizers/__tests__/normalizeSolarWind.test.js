import { describe, it, expect } from "vitest";
import {
  getLatestSolarWind,
  normalizeSolarWindArray,
  normalizeSolarWindRow,
} from "../normalizeSolarWind.js";

describe("normalizeSolarWind", () => {
  it("normalizes valid rows with a header", () => {
    const result = normalizeSolarWindArray([
      ["time_tag", "density", "speed", "temperature"],
      ["2026-05-06 17:17:00.000", "2.18", "376.0", "94592"],
      ["2026-05-06 17:18:00.000", "2.60", "384.6", "96914"],
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].error).toBeNull();
    expect(result[0].signal).toBe("solar_wind_speed");
    expect(result[1].value.speed_km_s).toBe(384.6);
  });

  it("keeps invalid numeric values as null when another value is present", () => {
    const result = normalizeSolarWindRow([
      "2026-05-06 17:17:00.000",
      "bad",
      null,
      "94592",
    ]);
    expect(result.error).toBeNull();
    expect(result.value.density_p_cm3).toBeNull();
    expect(result.value.speed_km_s).toBeNull();
    expect(result.value.temperature_k).toBe(94592);
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeSolarWindArray([])).toEqual([]);
  });

  it("returns the latest normalized sample", () => {
    const result = getLatestSolarWind([
      ["time_tag", "density", "speed", "temperature"],
      ["2026-05-06 17:17:00.000", "2.18", "376.0", "94592"],
    ]);
    expect(result.value.speed_km_s).toBe(376);
  });
});
