-- ============================================================
-- Upgrade 002: add a hero image URL to each tour.
-- Satisfies the "at least five relevant images" multimedia
-- requirement. The existing image_gradient stays as a graceful
-- fallback if an image fails to load.
-- ============================================================

USE ecotour;

ALTER TABLE tour
    ADD COLUMN image_url VARCHAR(255) DEFAULT NULL AFTER icon;

-- Relevant, royalty-free imagery (Unsplash). Themed per tour category.
UPDATE tour SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Pongo_pygmaeus_(orangutang).jpg?width=800' WHERE tour_id = 1; -- orangutan / wildlife
UPDATE tour SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Korbu_Asli_Village.JPG?width=800' WHERE tour_id = 2; -- Orang Asli village / community
UPDATE tour SET image_url = 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=70' WHERE tour_id = 3; -- waterfall / jungle trek
UPDATE tour SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Mangroves_(53575624549).jpg?width=800' WHERE tour_id = 4; -- mangrove kayak / river
UPDATE tour SET image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Hornbill_on_Gunung_Palung_National_Park.jpg?width=800' WHERE tour_id = 5; -- Rhinoceros Hornbill / birdwatching
UPDATE tour SET image_url = 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=70' WHERE tour_id = 6; -- sea turtle / marine
