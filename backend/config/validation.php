<?php
/**
 * Pure validation and money-calculation helpers shared by the API endpoints.
 * No side effects, no database access — covered by backend/tests/run_tests.php.
 */

/** True when $email is a syntactically valid address no longer than 100 chars. */
function is_valid_email($email) {
    return is_string($email)
        && strlen($email) <= 100
        && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/** Passwords must be at least 8 characters. Returns an error string or null. */
function password_error($password) {
    if (!is_string($password) || strlen($password) < 8) {
        return "Password must be at least 8 characters";
    }
    return null;
}

/**
 * Validates a booking date. Must be a real Y-m-d calendar date and not in
 * the past (relative to $today, injectable for tests). Returns error or null.
 */
function booking_date_error($date, $today = null) {
    if (!is_string($date)) return "Invalid booking date";
    $dt = DateTime::createFromFormat('Y-m-d', $date);
    if (!$dt || $dt->format('Y-m-d') !== $date) {
        return "Booking date must be in YYYY-MM-DD format";
    }
    $today = $today ?: date('Y-m-d');
    if ($date < $today) {
        return "Booking date cannot be in the past";
    }
    return null;
}

/**
 * Validates the participant count against the tour's group size limit.
 * Returns an error string or null.
 */
function participants_error($participants, $groupSize) {
    if (!is_numeric($participants) || (int)$participants != $participants || (int)$participants < 1) {
        return "Participants must be a whole number of at least 1";
    }
    if ($groupSize > 0 && (int)$participants > (int)$groupSize) {
        return "Participants cannot exceed the group size of {$groupSize}";
    }
    return null;
}

/**
 * Computes the conservation levy for a booking subtotal.
 *
 * @param float $subtotal  tour price x participants
 * @param array $funds     rows from tour_fund (each with fund_id, allocation_pct)
 * @return array ['levy' => float, 'splits' => [fund_id => amount]] all rounded to 2dp
 */
function calculate_levy($subtotal, array $funds) {
    $splits = [];
    $levy = 0.0;
    foreach ($funds as $f) {
        $amount = round($subtotal * ((float)$f['allocation_pct'] / 100), 2);
        $splits[(int)$f['fund_id']] = $amount;
        $levy += $amount;
    }
    return ['levy' => round($levy, 2), 'splits' => $splits];
}

/** Generates a booking reference like ECO-3FA9C1 from a CSPRNG. */
function generate_booking_ref() {
    return 'ECO-' . strtoupper(bin2hex(random_bytes(3)));
}
