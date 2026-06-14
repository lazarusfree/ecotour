<?php
/**
 * Session-based authentication helpers.
 *
 * login.php stores the authenticated user in $_SESSION['user']; endpoints
 * that need authorization call require_login() / require_admin() instead of
 * trusting identifiers sent by the client.
 */

function ecotour_session_start() {
    if (session_status() === PHP_SESSION_NONE) {
        session_name('ECOTOURSESSID');
        session_set_cookie_params([
            'httponly' => true,   // not readable from JavaScript
            'samesite' => 'Lax',  // CSRF mitigation for cross-site POSTs
            'path' => '/',
        ]);
        session_start();
    }
}

/** Returns the logged-in user array, or null when no session exists. */
function current_user() {
    ecotour_session_start();
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}

/** Aborts with 401 unless a user is logged in. Returns the user. */
function require_login($database) {
    $user = current_user();
    if (!$user) {
        $database->sendError("Authentication required. Please sign in.", 401);
    }
    return $user;
}

/** Aborts with 401/403 unless the logged-in user is an admin. Returns the user. */
function require_admin($database) {
    $user = require_login($database);
    if (($user['role'] ?? '') !== 'admin') {
        $database->sendError("Admin access required.", 403);
    }
    return $user;
}
