<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    json_ok(["ok" => true]);
}

date_default_timezone_set("UTC");

$configPath = __DIR__ . "/config.php";
if (!is_file($configPath)) {
    json_error("Missing api/config.php. Create DB config first.", 500);
}

$dbConfig = require $configPath;
if (!is_array($dbConfig)) {
    json_error("Invalid database config format.", 500);
}

try {
    $pdo = connect_db($dbConfig);
    ensure_schema($pdo);
} catch (Throwable $error) {
    json_error("Database init failed: " . $error->getMessage(), 500);
}

$action = "";
if (isset($_GET["action"])) {
    $action = trim((string) $_GET["action"]);
}
if ($action === "" && isset($_POST["action"])) {
    $action = trim((string) $_POST["action"]);
}

if ($action === "") {
    json_error("Missing action parameter.");
}

try {
    switch ($action) {
        case "health":
            json_ok([
                "status" => "ok",
                "driver" => "wamp-mysql",
                "serverTime" => now_ms(),
            ]);
            break;

        case "session_get":
            $sessionId = normalize_session_id($_GET["sessionId"] ?? "");
            require_session_id($sessionId);
            $session = load_session($pdo, $sessionId, false);
            json_ok(["session" => $session]);
            break;

        case "bundle_get":
            $sessionId = normalize_session_id($_GET["sessionId"] ?? "");
            require_session_id($sessionId);
            $session = load_session($pdo, $sessionId, false);
            if ($session === null) {
                json_ok([
                    "session" => null,
                    "players" => [],
                    "chat" => [],
                    "notes" => [],
                ]);
            }

            json_ok([
                "session" => $session,
                "players" => list_players($pdo, $sessionId),
                "chat" => list_chat($pdo, $sessionId),
                "notes" => list_notes($pdo, $sessionId),
            ]);
            break;

        case "session_create":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $payload = ensure_array($body["payload"] ?? []);
            require_session_id($sessionId);
            if (!isset($payload["sessionId"])) {
                $payload["sessionId"] = $sessionId;
            }
            save_session($pdo, $sessionId, $payload);
            json_ok(["session" => load_session($pdo, $sessionId, false)]);
            break;

        case "session_update":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $patch = ensure_array($body["patch"] ?? []);
            require_session_id($sessionId);

            $currentSession = load_session($pdo, $sessionId, false);
            if ($currentSession === null) {
                json_error("Session not found.", 404);
            }

            $updatedSession = array_merge($currentSession, $patch);
            $updatedSession["sessionId"] = $sessionId;
            save_session($pdo, $sessionId, $updatedSession);
            json_ok(["session" => load_session($pdo, $sessionId, false)]);
            break;

        case "player_upsert":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $uid = normalize_uid($body["uid"] ?? "");
            $playerPatch = ensure_array($body["playerPatch"] ?? []);
            require_session_id($sessionId);
            require_uid($uid);

            if (load_session($pdo, $sessionId, false) === null) {
                json_error("Session not found.", 404);
            }

            upsert_player($pdo, $sessionId, $uid, $playerPatch);
            json_ok(["players" => list_players($pdo, $sessionId)]);
            break;

        case "chat_add":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $message = ensure_array($body["message"] ?? []);
            require_session_id($sessionId);
            if (load_session($pdo, $sessionId, false) === null) {
                json_error("Session not found.", 404);
            }
            $created = add_chat($pdo, $sessionId, $message);
            json_ok(["message" => $created]);
            break;

        case "note_add":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $note = ensure_array($body["note"] ?? []);
            require_session_id($sessionId);
            if (load_session($pdo, $sessionId, false) === null) {
                json_error("Session not found.", 404);
            }
            $created = add_note($pdo, $sessionId, $note);
            json_ok(["note" => $created]);
            break;

        case "contribution_apply":
            require_method("POST");
            $body = read_json_body();
            $sessionId = normalize_session_id($body["sessionId"] ?? "");
            $uid = normalize_uid($body["uid"] ?? "");
            $avatarName = normalize_avatar_name($body["avatarName"] ?? "");
            $contribution = ensure_array($body["contribution"] ?? []);
            require_session_id($sessionId);
            require_uid($uid);
            if ($avatarName === "") {
                $avatarName = "Avatar";
            }

            apply_contribution($pdo, $sessionId, $uid, $avatarName, $contribution);
            json_ok([
                "session" => load_session($pdo, $sessionId, false),
                "players" => list_players($pdo, $sessionId),
            ]);
            break;

        default:
            json_error("Unknown action: " . $action, 404);
            break;
    }
} catch (Throwable $error) {
    json_error($error->getMessage(), 500);
}

function connect_db(array $config): PDO
{
    $host = (string) ($config["host"] ?? "127.0.0.1");
    $port = (int) ($config["port"] ?? 3306);
    $dbName = (string) ($config["database"] ?? "");
    $username = (string) ($config["username"] ?? "root");
    $password = (string) ($config["password"] ?? "");
    $charset = (string) ($config["charset"] ?? "utf8mb4");

    if ($dbName === "") {
        throw new RuntimeException("Database name is empty in api/config.php");
    }

    $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}";
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function ensure_schema(PDO $pdo): void
{
    $sql = [
        "CREATE TABLE IF NOT EXISTS sessions (
            session_id VARCHAR(16) PRIMARY KEY,
            payload LONGTEXT NOT NULL,
            updated_at BIGINT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        "CREATE TABLE IF NOT EXISTS players (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        "CREATE TABLE IF NOT EXISTS chat_messages (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(16) NOT NULL,
            payload LONGTEXT NOT NULL,
            created_at BIGINT NOT NULL,
            KEY idx_chat_session_created (session_id, created_at),
            CONSTRAINT fk_chat_session FOREIGN KEY (session_id)
              REFERENCES sessions(session_id)
              ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        "CREATE TABLE IF NOT EXISTS notes (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(16) NOT NULL,
            payload LONGTEXT NOT NULL,
            created_at BIGINT NOT NULL,
            KEY idx_notes_session_created (session_id, created_at),
            CONSTRAINT fk_notes_session FOREIGN KEY (session_id)
              REFERENCES sessions(session_id)
              ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        "CREATE TABLE IF NOT EXISTS actions (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            session_id VARCHAR(16) NOT NULL,
            payload LONGTEXT NOT NULL,
            created_at BIGINT NOT NULL,
            KEY idx_actions_session_created (session_id, created_at),
            CONSTRAINT fk_actions_session FOREIGN KEY (session_id)
              REFERENCES sessions(session_id)
              ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    ];

    foreach ($sql as $statement) {
        $pdo->exec($statement);
    }
}

function load_session(PDO $pdo, string $sessionId, bool $forUpdate): ?array
{
    $sql = "SELECT payload FROM sessions WHERE session_id = :sid";
    if ($forUpdate) {
        $sql .= " FOR UPDATE";
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute(["sid" => $sessionId]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }
    $session = decode_payload((string) $row["payload"]);
    if (!isset($session["sessionId"])) {
        $session["sessionId"] = $sessionId;
    }
    return $session;
}

function save_session(PDO $pdo, string $sessionId, array $payload): void
{
    $payload["sessionId"] = $sessionId;
    $updatedAt = now_ms();
    $stmt = $pdo->prepare(
        "INSERT INTO sessions (session_id, payload, updated_at)
         VALUES (:sid, :payload, :updated)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = VALUES(updated_at)"
    );
    $stmt->execute([
        "sid" => $sessionId,
        "payload" => encode_payload($payload),
        "updated" => $updatedAt,
    ]);
}

function load_player(PDO $pdo, string $sessionId, string $uid, bool $forUpdate): ?array
{
    $sql = "SELECT payload FROM players WHERE session_id = :sid AND uid = :uid";
    if ($forUpdate) {
        $sql .= " FOR UPDATE";
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        "sid" => $sessionId,
        "uid" => $uid,
    ]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }
    return decode_payload((string) $row["payload"]);
}

function upsert_player(PDO $pdo, string $sessionId, string $uid, array $playerPatch): void
{
    $current = load_player($pdo, $sessionId, $uid, false);
    $merged = array_merge($current ?? ["uid" => $uid, "role" => "player"], $playerPatch);
    $merged["uid"] = $uid;
    $updatedAt = now_ms();

    $stmt = $pdo->prepare(
        "INSERT INTO players (session_id, uid, payload, updated_at)
         VALUES (:sid, :uid, :payload, :updated)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload), updated_at = VALUES(updated_at)"
    );
    $stmt->execute([
        "sid" => $sessionId,
        "uid" => $uid,
        "payload" => encode_payload($merged),
        "updated" => $updatedAt,
    ]);
}

function list_players(PDO $pdo, string $sessionId): array
{
    $stmt = $pdo->prepare("SELECT payload FROM players WHERE session_id = :sid");
    $stmt->execute(["sid" => $sessionId]);
    $players = [];
    while ($row = $stmt->fetch()) {
        $players[] = decode_payload((string) $row["payload"]);
    }
    usort($players, static function (array $a, array $b): int {
        $left = (int) ($a["score"] ?? 0);
        $right = (int) ($b["score"] ?? 0);
        return $right <=> $left;
    });
    return $players;
}

function add_chat(PDO $pdo, string $sessionId, array $message): array
{
    if (!isset($message["id"]) || !is_string($message["id"]) || $message["id"] === "") {
        $message["id"] = generate_id("chat");
    }
    if (!isset($message["createdAt"])) {
        $message["createdAt"] = now_ms();
    }

    $createdAt = (int) $message["createdAt"];
    $stmt = $pdo->prepare(
        "INSERT INTO chat_messages (session_id, payload, created_at)
         VALUES (:sid, :payload, :created)"
    );
    $stmt->execute([
        "sid" => $sessionId,
        "payload" => encode_payload($message),
        "created" => $createdAt,
    ]);
    return $message;
}

function list_chat(PDO $pdo, string $sessionId, int $limit = 250): array
{
    $limit = max(1, min(500, $limit));
    $stmt = $pdo->prepare(
        "SELECT payload FROM chat_messages
         WHERE session_id = :sid
         ORDER BY created_at ASC
         LIMIT {$limit}"
    );
    $stmt->execute(["sid" => $sessionId]);
    $messages = [];
    while ($row = $stmt->fetch()) {
        $messages[] = decode_payload((string) $row["payload"]);
    }
    return $messages;
}

function add_note(PDO $pdo, string $sessionId, array $note): array
{
    if (!isset($note["id"]) || !is_string($note["id"]) || $note["id"] === "") {
        $note["id"] = generate_id("note");
    }
    if (!isset($note["createdAt"])) {
        $note["createdAt"] = now_ms();
    }

    $createdAt = (int) $note["createdAt"];
    $stmt = $pdo->prepare(
        "INSERT INTO notes (session_id, payload, created_at)
         VALUES (:sid, :payload, :created)"
    );
    $stmt->execute([
        "sid" => $sessionId,
        "payload" => encode_payload($note),
        "created" => $createdAt,
    ]);
    return $note;
}

function list_notes(PDO $pdo, string $sessionId, int $limit = 80): array
{
    $limit = max(1, min(400, $limit));
    $stmt = $pdo->prepare(
        "SELECT payload FROM notes
         WHERE session_id = :sid
         ORDER BY created_at DESC
         LIMIT {$limit}"
    );
    $stmt->execute(["sid" => $sessionId]);
    $notes = [];
    while ($row = $stmt->fetch()) {
        $notes[] = decode_payload((string) $row["payload"]);
    }
    return $notes;
}

function add_action(PDO $pdo, string $sessionId, array $action): void
{
    $createdAt = (int) ($action["createdAt"] ?? now_ms());
    $stmt = $pdo->prepare(
        "INSERT INTO actions (session_id, payload, created_at)
         VALUES (:sid, :payload, :created)"
    );
    $stmt->execute([
        "sid" => $sessionId,
        "payload" => encode_payload($action),
        "created" => $createdAt,
    ]);
}

function apply_contribution(PDO $pdo, string $sessionId, string $uid, string $avatarName, array $contribution): void
{
    $pdo->beginTransaction();
    try {
        $session = load_session($pdo, $sessionId, true);
        if ($session === null) {
            throw new RuntimeException("Session not found.");
        }

        $player = load_player($pdo, $sessionId, $uid, true);
        if ($player === null) {
            $player = [
                "uid" => $uid,
                "avatarName" => $avatarName,
                "role" => "player",
                "score" => 0,
                "contributions" => 0,
            ];
        }

        $points = max(0, (int) ($contribution["points"] ?? 0));
        $progressGain = max(0, (int) ($contribution["progressGain"] ?? 0));
        $damage = max(0, (int) ($contribution["damage"] ?? 0));
        $message = (string) ($contribution["message"] ?? "");
        $challengeType = (string) ($contribution["challengeType"] ?? "");
        $actionType = (string) ($contribution["actionType"] ?? "manual");
        $victoryMeme = (string) ($contribution["victoryMeme"] ?? "");
        $now = now_ms();

        $currentProgress = (int) ($session["progress"] ?? 0);
        $currentBossHp = (int) ($session["bossHp"] ?? 100);
        $currentTotalPoints = (int) ($session["totalPoints"] ?? 0);

        $nextProgress = clamp_int($currentProgress + $progressGain, 0, 100);
        $nextBossHp = clamp_int($currentBossHp - $damage, 0, 100);
        $nextTotalPoints = max(0, $currentTotalPoints + $points);
        $nextTeamLevel = max(1, min(20, ((int) floor($nextTotalPoints / 120)) + 1));

        $session["progress"] = $nextProgress;
        $session["bossHp"] = $nextBossHp;
        $session["totalPoints"] = $nextTotalPoints;
        $session["teamLevel"] = $nextTeamLevel;
        $session["lastContributionAt"] = $now;

        if ($nextProgress >= 100 || $nextBossHp <= 0) {
            $session["status"] = "victory";
            if (!isset($session["meme"]) || trim((string) $session["meme"]) === "") {
                $session["meme"] = $victoryMeme !== "" ? $victoryMeme : "Teamskill critical hit.";
            }
        }

        $player["uid"] = $uid;
        $player["avatarName"] = $avatarName;
        $player["role"] = $player["role"] ?? "player";
        $player["score"] = (int) ($player["score"] ?? 0) + $points;
        $player["contributions"] = (int) ($player["contributions"] ?? 0) + 1;
        $player["updatedAt"] = $now;

        save_session($pdo, $sessionId, $session);
        upsert_player($pdo, $sessionId, $uid, $player);

        add_action($pdo, $sessionId, [
            "id" => generate_id("act"),
            "uid" => $uid,
            "avatarName" => $avatarName,
            "challengeType" => $challengeType,
            "message" => $message,
            "points" => $points,
            "progressGain" => $progressGain,
            "damage" => $damage,
            "actionType" => $actionType,
            "createdAt" => $now,
        ]);

        $pdo->commit();
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $error;
    }
}

function now_ms(): int
{
    return (int) round(microtime(true) * 1000);
}

function require_method(string $method): void
{
    if (strtoupper($_SERVER["REQUEST_METHOD"] ?? "") !== strtoupper($method)) {
        json_error("Method not allowed.", 405);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents("php://input");
    if ($raw === false || trim($raw) === "") {
        return [];
    }
    $parsed = json_decode($raw, true);
    if (!is_array($parsed)) {
        return [];
    }
    return $parsed;
}

function require_session_id(string $sessionId): void
{
    if ($sessionId === "") {
        json_error("Invalid or missing sessionId.");
    }
}

function require_uid(string $uid): void
{
    if ($uid === "") {
        json_error("Invalid or missing uid.");
    }
}

function normalize_session_id($value): string
{
    $clean = strtoupper((string) preg_replace("/[^A-Za-z0-9]/", "", (string) $value));
    return substr($clean, 0, 12);
}

function normalize_uid($value): string
{
    $clean = (string) preg_replace("/[^A-Za-z0-9_-]/", "", (string) $value);
    return substr($clean, 0, 140);
}

function normalize_avatar_name($value): string
{
    $clean = trim((string) preg_replace("/[\\x00-\\x1F\\x7F]/", "", (string) $value));
    return substr($clean, 0, 80);
}

function clamp_int(int $value, int $min, int $max): int
{
    if ($value < $min) {
        return $min;
    }
    if ($value > $max) {
        return $max;
    }
    return $value;
}

function ensure_array($value): array
{
    return is_array($value) ? $value : [];
}

function encode_payload(array $payload): string
{
    return json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    ) ?: "{}";
}

function decode_payload(string $payload): array
{
    $decoded = json_decode($payload, true);
    return is_array($decoded) ? $decoded : [];
}

function generate_id(string $prefix): string
{
    try {
        $random = bin2hex(random_bytes(5));
    } catch (Throwable $error) {
        $random = str_replace(".", "", uniqid("", true));
    }
    return $prefix . "-" . $random;
}

function json_ok(array $data = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode(
        ["ok" => true, "data" => $data],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

function json_error(string $message, int $status = 400): void
{
    http_response_code($status);
    echo json_encode(
        ["ok" => false, "error" => $message],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}
