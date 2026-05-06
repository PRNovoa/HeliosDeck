import { describe, it, expect } from "vitest";
import { normalizeISS } from "../normalizeISS.js";

describe("normalizeISS", () => {
  const validRaw = {
    latitude: "48.32",
    longitude: "-23.11",
    altitude: "408.2",
    velocity: "27580.4",
    visibility: "daylight",
    timestamp: 1710594600,
    id: 25544,
  };

  it("returns a valid NormalizedSignal for good input", () => {
    const result = normalizeISS(validRaw);
    expect(result.error).toBeNull();
    expect(result.signal).toBe("iss_coordinates");
    expect(result.source).toBe("ISS_API");
    expect(result.value.latitude).toBe(48.32);
    expect(result.value.longitude).toBe(-23.11);
    expect(result.value.altitude_km).toBe(408.2);
    expect(result.value.velocity_kmh).toBe(27580.4);
    expect(result.value.visibility).toBe("daylight");
    expect(result.unit).toBe("degrees_lat_lon");
    expect(result.confidence).toBe(0.99);
  });

  it("converts unix timestamp to ISO 8601", () => {
    const result = normalizeISS(validRaw);
    expect(result.timestamp).toBe("2024-03-16T13:10:00.000Z");
  });

  it("falls back nullable numeric fields to null", () => {
    const result = normalizeISS({
      latitude: "48.32",
      longitude: "-23.11",
      altitude: "bad",
      velocity: undefined,
    });
    expect(result.error).toBeNull();
    expect(result.value.altitude_km).toBeNull();
    expect(result.value.velocity_kmh).toBeNull();
  });

  it("returns error signal for null input", () => {
    const result = normalizeISS(null);
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("returns error signal for missing lat/lon", () => {
    const result = normalizeISS({ altitude: 400 });
    expect(result.error).toBeTruthy();
  });

  it("returns error signal for invalid timestamp", () => {
    const result = normalizeISS({
      ...validRaw,
      timestamp: "not-a-timestamp",
    });
    expect(result.error).toBeTruthy();
    expect(result.value).toBeNull();
  });

  it("returns error signal for non-numeric lat/lon", () => {
    const result = normalizeISS({ latitude: "abc", longitude: "xyz" });
    expect(result.error).toBeTruthy();
  });

  it("sets metadata.norad_id from raw.id", () => {
    const result = normalizeISS(validRaw);
    expect(result.metadata.norad_id).toBe(25544);
  });
});
