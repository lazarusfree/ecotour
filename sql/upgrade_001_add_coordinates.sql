-- ============================================================
-- Upgrade 001: add map coordinates to existing tours.
-- For databases created before latitude/longitude were added
-- to the schema. Safe to skip on a fresh install.
-- ============================================================

USE ecotour;

ALTER TABLE tour
    ADD COLUMN latitude DECIMAL(9,6) DEFAULT NULL AFTER icon,
    ADD COLUMN longitude DECIMAL(9,6) DEFAULT NULL AFTER latitude;

UPDATE tour SET latitude = 4.960000, longitude = 117.800000 WHERE tour_id = 1; -- Danum Valley
UPDATE tour SET latitude = 4.383000, longitude = 102.400000 WHERE tour_id = 2; -- Taman Negara
UPDATE tour SET latitude = 2.530000, longitude = 103.320000 WHERE tour_id = 3; -- Endau-Rompin
UPDATE tour SET latitude = 6.130000, longitude = 102.240000 WHERE tour_id = 4; -- Kota Bharu
UPDATE tour SET latitude = 4.400000, longitude = 113.990000 WHERE tour_id = 5; -- Miri
UPDATE tour SET latitude = 5.920000, longitude = 102.740000 WHERE tour_id = 6; -- Perhentian Islands
