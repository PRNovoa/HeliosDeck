import { SOURCE, SIGNAL } from "@/lib/constants.js";

const PROVIDER = "NOAA SWPC";

export function normalizeSpaceWeatherAlert(raw) {
  if (!raw || typeof raw !== "object") {
    return makeError("Invalid NOAA alert payload");
  }

  const message = String(raw.message ?? raw.summary ?? raw.title ?? "");
  const messageType = extractMessageType(raw, message);
  const timestamp = parseTimestamp(raw.issue_datetime ?? raw.issueTime);

  if (!message && !raw.product_id) {
    return makeError("Missing alert message");
  }

  return {
    timestamp,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SPACE_WEATHER_ALERTS,
    value: {
      productId: raw.product_id ?? raw.productId ?? null,
      messageCode: extractLineValue(message, "Space Weather Message Code"),
      serialNumber: extractLineValue(message, "Serial Number"),
      issueTime: extractLineValue(message, "Issue Time") ?? raw.issue_datetime ?? null,
      messageType,
      title: extractTitle(message, messageType),
      summary: summarizeMessage(message),
      severity: classifySeverity(messageType),
      url: extractUrl(message),
    },
    unit: "alert",
    confidence: null,
    metadata: {
      provider: PROVIDER,
      cadence_seconds: 300,
    },
    error: null,
  };
}

export function normalizeSpaceWeatherAlertArray(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(normalizeSpaceWeatherAlert)
    .filter((signal) => signal.error === null)
    .sort((a, b) => new Date(b.timestamp ?? 0) - new Date(a.timestamp ?? 0));
}

function extractMessageType(raw, message) {
  const rawType = raw.message_type ?? raw.messageType;
  if (rawType) return String(rawType).toUpperCase();
  const title = message
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^(WARNING|ALERT|WATCH|SUMMARY|UPDATE)\b/i.test(line));
  return title?.match(/^(WARNING|ALERT|WATCH|SUMMARY|UPDATE)\b/i)?.[1]?.toUpperCase() ?? "UNKNOWN";
}

function classifySeverity(messageType) {
  if (messageType === "WARNING" || messageType === "ALERT") return "high";
  if (messageType === "WATCH") return "medium";
  if (messageType === "SUMMARY" || messageType === "UPDATE") return "low";
  return "unknown";
}

function extractLineValue(message, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = message.match(new RegExp(`${escaped}:\\s*(.+)`, "i"));
  return match?.[1]?.trim() ?? null;
}

function extractTitle(message, messageType) {
  const lines = message.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return (
    lines.find((line) => line.toUpperCase().startsWith(`${messageType}:`)) ??
    lines.find((line) => /^(WARNING|ALERT|WATCH|SUMMARY|UPDATE)\b/i.test(line)) ??
    lines[0] ??
    "NOAA space weather alert"
  );
}

function summarizeMessage(message) {
  const lines = message.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return (
    lines.find((line) => line.includes("NOAA Scale:")) ??
    lines.find((line) => line.includes("Potential Impacts:")) ??
    lines.find((line) => /^(WARNING|ALERT|WATCH|SUMMARY|UPDATE)\b/i.test(line)) ??
    lines[0] ??
    null
  );
}

function extractUrl(message) {
  const match = message.match(/https?:\/\/\S+|www\.\S+/i);
  if (!match) return null;
  return match[0].startsWith("http") ? match[0] : `https://${match[0]}`;
}

function parseTimestamp(value) {
  if (!value) return null;
  const normalized = String(value).includes("T")
    ? String(value)
    : `${String(value).replace(" ", "T")}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function makeError(message) {
  return {
    timestamp: null,
    source: SOURCE.NOAA_SWPC,
    signal: SIGNAL.SPACE_WEATHER_ALERTS,
    value: null,
    unit: "alert",
    confidence: null,
    metadata: {},
    error: message,
  };
}
