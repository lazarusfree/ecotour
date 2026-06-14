<?php
/**
 * Central application configuration.
 *
 * Every value can be overridden with an environment variable so that real
 * credentials never need to be committed to source control (set them in
 * Apache via SetEnv, or in the OS environment). The fallbacks match a
 * default local XAMPP install.
 */
return [
    'db_host'     => getenv('ECOTOUR_DB_HOST') ?: 'localhost',
    'db_name'     => getenv('ECOTOUR_DB_NAME') ?: 'ecotour',
    'db_user'     => getenv('ECOTOUR_DB_USER') ?: 'root',
    'db_pass'     => getenv('ECOTOUR_DB_PASS') !== false ? getenv('ECOTOUR_DB_PASS') : '',
    // Lock this down to your real origin in production, e.g. https://ecotour.my
    'cors_origin' => getenv('ECOTOUR_CORS_ORIGIN') ?: '*',
];
