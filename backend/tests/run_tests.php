<?php
/**
 * Unit tests for backend/config/validation.php (no DB or server required).
 *
 * Run:  C:\xampp\php\php.exe backend/tests/run_tests.php
 * Exits non-zero on failure.
 */
require_once __DIR__ . '/../config/validation.php';

$passed = 0;
$failed = 0;

function check($label, $condition) {
    global $passed, $failed;
    if ($condition) {
        $passed++;
        echo "  ok    $label\n";
    } else {
        $failed++;
        echo "  FAIL  $label\n";
    }
}

echo "is_valid_email\n";
check("accepts a normal address", is_valid_email('rezza@ecotour.my'));
check("accepts subdomains", is_valid_email('a.b@mail.example.com'));
check("rejects missing @", !is_valid_email('not-an-email'));
check("rejects missing domain", !is_valid_email('user@'));
check("rejects empty string", !is_valid_email(''));
check("rejects non-string", !is_valid_email(null));
check("rejects > 100 chars", !is_valid_email(str_repeat('a', 95) . '@ex.com'));

echo "password_error\n";
check("accepts 8 chars", password_error('abcd1234') === null);
check("rejects 7 chars", password_error('abcd123') !== null);
check("rejects empty", password_error('') !== null);
check("rejects non-string", password_error(null) !== null);

echo "booking_date_error\n";
check("accepts today", booking_date_error('2026-06-13', '2026-06-13') === null);
check("accepts future date", booking_date_error('2026-07-15', '2026-06-13') === null);
check("rejects past date", booking_date_error('2026-06-12', '2026-06-13') !== null);
check("rejects bad format", booking_date_error('15/07/2026') !== null);
check("rejects impossible date", booking_date_error('2026-02-30') !== null);
check("rejects non-string", booking_date_error(12345) !== null);

echo "participants_error\n";
check("accepts 1", participants_error(1, 8) === null);
check("accepts group-size max", participants_error(8, 8) === null);
check("accepts numeric string", participants_error('3', 8) === null);
check("rejects zero", participants_error(0, 8) !== null);
check("rejects negative", participants_error(-2, 8) !== null);
check("rejects fraction", participants_error(2.5, 8) !== null);
check("rejects over group size", participants_error(9, 8) !== null);
check("rejects non-numeric", participants_error('abc', 8) !== null);
check("ignores limit when group size is 0", participants_error(50, 0) === null);

echo "calculate_levy\n";
// Orangutan Canopy Trek: RM280 x 2 = 560, funds 15% + 10% + 5% = 30% => 168
$funds = [
    ['fund_id' => 1, 'allocation_pct' => '15.00'],
    ['fund_id' => 2, 'allocation_pct' => '10.00'],
    ['fund_id' => 3, 'allocation_pct' => '5.00'],
];
$r = calculate_levy(560.00, $funds);
check("total levy = 168.00", $r['levy'] === 168.00);
check("split fund 1 = 84.00", $r['splits'][1] === 84.00);
check("split fund 2 = 56.00", $r['splits'][2] === 56.00);
check("split fund 3 = 28.00", $r['splits'][3] === 28.00);

// Village Stay: RM195 x 2 = 390, funds 12% + 8% = 20% => 78 (NOT a flat 30%)
$r = calculate_levy(390.00, [
    ['fund_id' => 2, 'allocation_pct' => '12.00'],
    ['fund_id' => 3, 'allocation_pct' => '8.00'],
]);
check("per-tour levy of 20% = 78.00", $r['levy'] === 78.00);

$r = calculate_levy(100.00, []);
check("no funds means zero levy", $r['levy'] === 0.0 && $r['splits'] === []);

// Rounding: 33.335 * 10% = 3.3335 -> 3.33 per fund, summed after rounding
$r = calculate_levy(33.335, [
    ['fund_id' => 1, 'allocation_pct' => '10.00'],
    ['fund_id' => 2, 'allocation_pct' => '10.00'],
]);
check("splits rounded to 2dp", $r['splits'][1] === 3.33 && $r['levy'] === 6.66);

echo "generate_booking_ref\n";
$ref = generate_booking_ref();
check("matches ECO-XXXXXX format", preg_match('/^ECO-[0-9A-F]{6}$/', $ref) === 1);
check("fits VARCHAR(12) column", strlen($ref) <= 12);
$refs = [];
for ($i = 0; $i < 200; $i++) $refs[generate_booking_ref()] = true;
check("200 generated refs are unique", count($refs) === 200);

echo "\n$passed passed, $failed failed\n";
exit($failed === 0 ? 0 : 1);
