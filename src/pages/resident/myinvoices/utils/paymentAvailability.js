const TRUE_VALUES = new Set([true, 1, "1", "true", "active", "enabled", "open", "on"]);
const FALSE_VALUES = new Set([false, 0, "0", "false", "inactive", "disabled", "closed", "off"]);

const DIRECT_FLAG_PATHS = [
  ["online_payment"],
  ["online_payment_enabled"],
  ["enable_online_payment"],
  ["is_online_payment_active"],
  ["is_payment_active"],
  ["payment_enabled"],
  ["pre_paid"],
  ["payment_gateway_details", "active"],
  ["payment_gateway_details", "enabled"],
  ["payment_gateway_details", "status"],
  ["complex_service_module", "online_payment"],
  ["complex_service_module", "payment_enabled"],
];

function normalizeFlagValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (TRUE_VALUES.has(normalized)) return true;
    if (FALSE_VALUES.has(normalized)) return false;
    return null;
  }
  if (TRUE_VALUES.has(value)) return true;
  if (FALSE_VALUES.has(value)) return false;
  return null;
}

function getByPath(source, path) {
  return path.reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), source);
}

function resolveFromSource(source) {
  if (!source || typeof source !== "object") return null;

  for (const path of DIRECT_FLAG_PATHS) {
    const normalized = normalizeFlagValue(getByPath(source, path));
    if (normalized !== null) {
      return normalized;
    }
  }

  const nestedCandidates = [
    source.sub_data,
    source.complex,
    source.property,
    source.apartment,
    source.real_estate,
    source.meta,
  ];

  for (const candidate of nestedCandidates) {
    const resolved = resolveFromSource(candidate);
    if (resolved !== null) {
      return resolved;
    }
  }

  return null;
}

export function isResidentOnlinePaymentEnabled(...sources) {
  for (const source of sources) {
    const resolved = resolveFromSource(source);
    if (resolved !== null) {
      return resolved;
    }
  }

  return true;
}

export const RESIDENT_OFFICE_PAYMENT_MESSAGE = "Onlayn ödəniş aktiv deyil. Zəhmət olmasa ödəniş üçün ofisə yaxınlaşın.";