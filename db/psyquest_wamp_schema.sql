CREATE DATABASE IF NOT EXISTS psyquest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE psyquest;

CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(16) PRIMARY KEY,
  payload LONGTEXT NOT NULL,
  updated_at BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS players (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(16) NOT NULL,
  uid VARCHAR(140) NOT NULL,
  payload LONGTEXT NOT NULL,
  updated_at BIGINT NOT NULL,
  UNIQUE KEY uq_session_uid (session_id, uid),
  KEY idx_players_session (session_id),
  CONSTRAINT fk_players_session FOREIGN KEY (session_id)
    REFERENCES sessions(session_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(16) NOT NULL,
  payload LONGTEXT NOT NULL,
  created_at BIGINT NOT NULL,
  KEY idx_chat_session_created (session_id, created_at),
  CONSTRAINT fk_chat_session FOREIGN KEY (session_id)
    REFERENCES sessions(session_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(16) NOT NULL,
  payload LONGTEXT NOT NULL,
  created_at BIGINT NOT NULL,
  KEY idx_notes_session_created (session_id, created_at),
  CONSTRAINT fk_notes_session FOREIGN KEY (session_id)
    REFERENCES sessions(session_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS actions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(16) NOT NULL,
  payload LONGTEXT NOT NULL,
  created_at BIGINT NOT NULL,
  KEY idx_actions_session_created (session_id, created_at),
  CONSTRAINT fk_actions_session FOREIGN KEY (session_id)
    REFERENCES sessions(session_id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
