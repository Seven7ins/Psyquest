/* eslint-disable no-unused-vars */
/**
 * PsyQuest backend runtime configuration.
 * WAMP/MySQL is the default self-hosted mode.
 */
window.PSYQUEST_BACKEND_CONFIG = {
  mode: "wamp",
  apiBaseUrl: "./api/index.php",
  pollIntervalMs: 1500
};
