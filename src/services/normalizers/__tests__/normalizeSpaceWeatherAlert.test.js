import { describe, it, expect } from "vitest";
import {
  normalizeSpaceWeatherAlert,
  normalizeSpaceWeatherAlertArray,
} from "../normalizeSpaceWeatherAlert.js";

const alert = {
  product_id: "K05A",
  issue_datetime: "2026-05-05 02:49:25.467",
  message:
    "Space Weather Message Code: ALTK05\r\n" +
    "Serial Number: 2016\r\n" +
    "Issue Time: 2026 May 05 0249 UTC\r\n\r\n" +
    "ALERT: Geomagnetic K-index of 5\r\n" +
    "NOAA Scale: G1 - Minor",
};

describe("normalizeSpaceWeatherAlert", () => {
  it("normalizes a valid alert array", () => {
    const result = normalizeSpaceWeatherAlertArray([alert]);
    expect(result).toHaveLength(1);
    expect(result[0].error).toBeNull();
    expect(result[0].signal).toBe("space_weather_alerts");
    expect(result[0].source).toBe("NOAA_SWPC");
    expect(result[0].value.messageType).toBe("ALERT");
    expect(result[0].value.severity).toBe("high");
  });

  it("returns an empty array for empty input", () => {
    expect(normalizeSpaceWeatherAlertArray([])).toEqual([]);
  });

  it("marks unknown message types as unknown severity", () => {
    const result = normalizeSpaceWeatherAlert({
      product_id: "UNK",
      issue_datetime: "2026-05-05 02:49:25.467",
      message: "Space Weather Message Code: TEST\nSomething unusual",
    });
    expect(result.error).toBeNull();
    expect(result.value.messageType).toBe("UNKNOWN");
    expect(result.value.severity).toBe("unknown");
  });
});
