import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const targetPath = resolve(process.cwd(), "firebase-config.js");

const keyCandidates = {
  apiKey: ["FIREBASE_API_KEY", "VITE_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_API_KEY"],
  authDomain: ["FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
  projectId: ["FIREBASE_PROJECT_ID", "VITE_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  storageBucket: ["FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_STORAGE_BUCKET", "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: [
    "FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  ],
  appId: ["FIREBASE_APP_ID", "VITE_FIREBASE_APP_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"],
  databaseURL: [
    "FIREBASE_DATABASE_URL",
    "VITE_FIREBASE_DATABASE_URL",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    "FIREBASE_DB_URL"
  ]
};

const defaults = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com"
};

function parseOptionalJsonEnv() {
  const raw = process.env.FIREBASE_CONFIG_JSON || process.env.FIREBASE_WEB_CONFIG_JSON || "";
  if (!raw) {
    return { data: {}, source: null, parseError: null };
  }
  try {
    const parsed = JSON.parse(raw);
    return { data: parsed && typeof parsed === "object" ? parsed : {}, source: "FIREBASE_CONFIG_JSON", parseError: null };
  } catch (error) {
    return { data: {}, source: "FIREBASE_CONFIG_JSON", parseError: String(error.message || error) };
  }
}

function normalizeValue(firebaseKey, rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return value;
  }
  if (firebaseKey === "authDomain") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      try {
        return new URL(value).hostname;
      } catch (_error) {
        return value.replace(/^https?:\/\//, "").replace(/\/+$/, "");
      }
    }
    return value.replace(/\/+$/, "");
  }
  if (firebaseKey === "databaseURL") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value.replace(/\/+$/, "");
    }
    return `https://${value.replace(/\/+$/, "")}`;
  }
  return value;
}

const jsonEnv = parseOptionalJsonEnv();
const config = {};
const missingFirebaseKeys = [];
const keySources = {};

Object.entries(keyCandidates).forEach(([firebaseKey, candidates]) => {
  let selectedValue = "";
  let source = "";

  for (const envName of candidates) {
    const envValue = process.env[envName];
    if (envValue) {
      selectedValue = envValue;
      source = envName;
      break;
    }
  }

  if (!selectedValue && jsonEnv.data[firebaseKey]) {
    selectedValue = jsonEnv.data[firebaseKey];
    source = jsonEnv.source || "FIREBASE_CONFIG_JSON";
  }

  selectedValue = normalizeValue(firebaseKey, selectedValue);

  if (!selectedValue) {
    config[firebaseKey] = defaults[firebaseKey];
    keySources[firebaseKey] = "placeholder";
    missingFirebaseKeys.push(firebaseKey);
    return;
  }

  config[firebaseKey] = selectedValue;
  keySources[firebaseKey] = source || "unknown";
});

const generatedAt = new Date().toISOString();
const completeConfig = missingFirebaseKeys.length === 0;
const banner = completeConfig
  ? "Generated from Netlify environment variables."
  : "Generated with fallback placeholders (missing config keys).";

const meta = {
  generatedAt,
  completeConfig,
  missingFirebaseKeys,
  keySources,
  jsonEnvParseError: jsonEnv.parseError
};

const fileContent = `/* eslint-disable no-unused-vars */
/**
 * PsyQuest Firebase configuration.
 * ${banner}
 * Generated at: ${generatedAt}
 */
window.PSYQUEST_FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};
window.PSYQUEST_FIREBASE_CONFIG_META = ${JSON.stringify(meta, null, 2)};
`;

writeFileSync(targetPath, fileContent, "utf8");

if (completeConfig) {
  console.log("[psyquest] firebase-config.js generated from environment variables.");
} else {
  console.warn(
    `[psyquest] firebase-config.js generated with placeholders. Missing keys: ${missingFirebaseKeys.join(", ")}`
  );
}

if (jsonEnv.parseError) {
  console.warn(`[psyquest] FIREBASE_CONFIG_JSON parse error: ${jsonEnv.parseError}`);
}
