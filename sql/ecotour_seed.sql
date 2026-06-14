-- ============================================================
-- EcoTour — Seed / Demo Data
-- Run after sql/ecotour_schema.sql.
-- Demo accounts:
--   rezza@ecotour.my / password123  (traveler)
--   admin@ecotour.my / admin123    (admin)
-- ============================================================

USE ecotour;

INSERT INTO user (user_id, full_name, email, password_hash, role, eco_score) VALUES
(1, 'Ahmad Rezza',     'rezza@ecotour.my',    '$2y$10$zy4sgfIQ3EesFx3chVLZDOr/ZEWPiqdgQEGFTSEu53ckWRcvr1nq6', 'traveler', 892),
(2, 'Nurin Sofiya',    'nurin@ecotour.my',    '$2y$10$zy4sgfIQ3EesFx3chVLZDOr/ZEWPiqdgQEGFTSEu53ckWRcvr1nq6', 'traveler', 410),
(3, 'Hafidzul Rahman', 'hafidzul@ecotour.my', '$2y$10$zy4sgfIQ3EesFx3chVLZDOr/ZEWPiqdgQEGFTSEu53ckWRcvr1nq6', 'operator', 0),
(4, 'Muaz Fahmi',      'muaz@ecotour.my',     '$2y$10$zy4sgfIQ3EesFx3chVLZDOr/ZEWPiqdgQEGFTSEu53ckWRcvr1nq6', 'operator', 0),
(5, 'Admin EcoTour',   'admin@ecotour.my',    '$2y$10$TSGziQRWknOuP9Utc6O.m.B7.2UgnrQ2hVFY6U3TD7NV8dwZnuxQq', 'admin', 0);

INSERT INTO operator (operator_id, user_id, business_name, description, location, state, eco_score, verification_status, certification) VALUES
(1, 3, 'Borneo Naturalist Expeditions', 'Certified eco-tour operator specializing in wildlife encounters and canopy treks in Sabah conservation areas.', 'Danum Valley', 'Sabah', 94, 'verified', 'MyEcoCert L3'),
(2, 4, 'Taman Negara Eco Adventures', 'Community-based eco-tourism working with Orang Asli villages in Taman Negara.', 'Kuala Tahan', 'Pahang', 87, 'verified', 'MyEcoCert L2'),
(3, NULL, 'Kelantan River Eco Tours', 'River-based eco-tours along Kelantan waterways with community guides.', 'Kota Bharu', 'Kelantan', 76, 'pending', NULL),
(4, NULL, 'Green Tiger Adventures', 'Adventure tourism operator — under review for greenwashing concerns.', 'Kuching', 'Sarawak', 41, 'flagged', NULL);

INSERT INTO tour (tour_id, operator_id, title, description, category, location, state, duration, group_size, difficulty, price, eco_score, image_gradient, icon, image_url, latitude, longitude) VALUES
(1, 1, 'Orangutan Canopy Trek', 'An immersive 2-day canopy walk and wildlife encounter at Danum Valley. Led by certified naturalists, directly funds Sabah Wildlife rehabilitation.', 'wildlife', 'Danum Valley', 'Sabah', '2 days', 8, 'moderate', 280.00, 96, 'from-emerald-600 to-green-800', 'fa-paw', 'https://commons.wikimedia.org/wiki/Special:FilePath/Pongo_pygmaeus_(orangutang).jpg?width=800', 4.960000, 117.800000),
(2, 2, 'Orang Asli Village Stay', 'Authentic cultural immersion with indigenous communities deep in Taman Negara rainforest.', 'community', 'Taman Negara', 'Pahang', '3 days', 6, 'easy', 195.00, 91, 'from-amber-600 to-orange-800', 'fa-people-roof', 'https://commons.wikimedia.org/wiki/Special:FilePath/Korbu_Asli_Village.JPG?width=800', 4.383000, 102.400000),
(3, 1, 'Waterfall Rainforest Trail', 'Trek through ancient rainforests to hidden waterfalls and natural pools in Endau-Rompin.', 'jungle_trek', 'Endau-Rompin', 'Johor', '1 day', 10, 'challenging', 150.00, 88, 'from-teal-600 to-cyan-800', 'fa-water', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=70', 2.530000, 103.320000),
(4, 2, 'Kelantan Mangrove Kayak', 'Paddle through mangrove forests with community guides. Supports local conservation projects.', 'river_coast', 'Kota Bharu', 'Kelantan', '1 day', 8, 'easy', 90.00, 85, 'from-blue-600 to-indigo-800', 'fa-person-swimming', 'https://commons.wikimedia.org/wiki/Special:FilePath/Mangroves_(53575624549).jpg?width=800', 6.130000, 102.240000),
(5, 1, 'Sarawak Hornbill Watch', 'Guided birdwatching expedition in Miri featuring rare hornbill species and tropical birds.', 'birdwatching', 'Miri', 'Sarawak', '1 day', 6, 'easy', 120.00, 90, 'from-lime-600 to-green-800', 'fa-dove', 'https://commons.wikimedia.org/wiki/Special:FilePath/Hornbill_on_Gunung_Palung_National_Park.jpg?width=800', 4.400000, 113.990000),
(6, 1, 'Turtle Island Conservation', 'Overnight conservation experience at turtle nesting sites. Directly supports marine conservation.', 'wildlife', 'Perhentian Islands', 'Terengganu', '2 days', 8, 'moderate', 350.00, 95, 'from-cyan-600 to-blue-800', 'fa-shield-halved', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=70', 5.920000, 102.740000);

INSERT INTO conservation_fund (fund_id, name, category, allocation_pct, target_amount, collected_amount) VALUES
(1, 'Sabah Wildlife Fund', 'wildlife', 15.00, 400000.00, 312000.00),
(2, 'Local Community Fund', 'community', 10.00, 300000.00, 267000.00),
(3, 'Reforestation Malaysia', 'reforestation', 5.00, 150000.00, 89000.00);

INSERT INTO tour_fund (tour_id, fund_id, allocation_pct) VALUES
(1, 1, 15.00), (1, 2, 10.00), (1, 3, 5.00),
(2, 2, 12.00), (2, 3, 8.00),
(3, 1, 10.00), (3, 3, 5.00),
(4, 2, 10.00), (4, 3, 5.00),
(5, 1, 10.00), (5, 2, 5.00),
(6, 1, 15.00), (6, 2, 8.00), (6, 3, 5.00);

INSERT INTO verification_criteria (name, weight, data_source, is_automated) VALUES
('Wildlife Disturbance Protocol', 15.00, 'DOE Permit', 1),
('Renewable Energy Usage', 12.00, 'TNB/SEDA cert', 1),
('Local Guide Employment', 10.00, 'Self-declared + audit', 0),
('Community Revenue Share', 10.00, 'Ledger data', 1),
('Plastic-Free Operations', 8.00, 'On-site audit', 0);

INSERT INTO booking (booking_id, user_id, tour_id, booking_ref, booking_date, participants, total_amount, conservation_levy, status) VALUES
(1, 1, 2, 'ECO-A3F8K2', '2026-03-15', 2, 452.00, 78.00, 'completed'),
(2, 1, 6, 'ECO-B7D2M9', '2026-05-20', 1, 402.00, 105.00, 'completed'),
(3, 2, 1, 'ECO-C1H4P6', '2026-04-10', 2, 644.00, 168.00, 'completed'),
(4, 1, 1, 'ECO-D9J3R7', '2026-07-15', 2, 728.00, 168.00, 'confirmed');

INSERT INTO fund_ledger (booking_id, fund_id, amount) VALUES
(1, 2, 46.80), (1, 3, 31.20),
(2, 1, 52.50), (2, 2, 28.00), (2, 3, 17.50),
(3, 1, 84.00), (3, 2, 56.00), (3, 3, 28.00),
(4, 1, 84.00), (4, 2, 56.00), (4, 3, 28.00);
