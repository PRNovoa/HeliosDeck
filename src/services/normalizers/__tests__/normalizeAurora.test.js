import { describe, expect, it } from "vitest";
import { normalizeAurora } from "../normalizeAurora.js";

const rawAurora = {
  "Observation Time": "2026-05-06T19:36:00Z",
  "Forecast Time": "2026-05-06T20:45:00Z",
  coordinates: [
    [0, 65, 12],
    [10, 66, 48],
    [20, -67, 22],
  ],
};

describe("normalizeAurora", () => {
  it("summarizes the aurora probability grid", () => {
    const result = normalizeAurora(rawAurora);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("auroral_oval_probability");
    expect(result.value.max_probability_pct).toBe(48);
    expect(result.value.northern_max_pct).toBe(48);
    expect(result.value.southern_max_pct).toBe(22);
  });

  it("returns an error signal for missing coordinates", () => {
    const result = normalizeAurora({ "Observation Time": "2026-05-06T19:36:00Z" });
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });
});
