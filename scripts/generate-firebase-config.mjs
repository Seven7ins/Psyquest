import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const targetPath = resolve(process.cwd(), "firebase-config.js");

const envToFirebaseKey = {
  FIREBASE_API_KEY: "apiKey",
  FIREBASE_AUTH_DOMAIN: "authDomain",
  FIREBASE_PROJECT_ID: "projectId",
  FIREBASE_STORAGE_BUCKET: "storageBucket",
  FIREBASE_MESSAGING_SENDER_ID: "messagingSenderId",
  FIREBASE_APP_ID: "appId",
  FIREBASE_DATABASE_URL: "databaseURL"
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

const config = {};
const missing = [];

Object.entries(envToFirebaseKey).forEach(([envName, firebaseKey]) => {
  const value = process.env[envName];
  if (!value) {
    missing.push(envName);
    config[firebaseKey] = defaults[firebaseKey];
    return;
  }
  config[firebaseKey] = value;
});

const generatedAt = new Date().toISOString();
const completeConfig = missing.length === 0;

const banner = completeConfig
  ? "Generated from Netlify environment variables."
  : "Generated with fallback placeholders (missing env vars).";

const fileContent = `/* eslint-disable no-unused-vars */
/**
 * PsyQuest Firebase configuration.
 * ${banner}
 * Generated at: ${generatedAt}
 */
window.PSYQUEST_FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};
`;

writeFileSync(targetPath, fileContent, "utf8");

if (completeConfig) {
  console.log("[psyquest] firebase-config.js generated from environment variables.");
} else {
  console.warn(
    `[psyquest] firebase-config.js generated with placeholders. Missing: ${missing.join(", ")}`
  );
}
