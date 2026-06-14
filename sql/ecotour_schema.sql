-- ============================================================
-- EcoTour — Database Schema
-- Run this first, then sql/ecotour_seed.sql for demo data.
--   C:\xampp\mysql\bin\mysql.exe -u root < sql/ecotour_schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecotour CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecotour;

-- Users (travelers, operators, admins)
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('traveler', 'operator', 'admin') DEFAULT 'traveler',
    eco_score INT DEFAULT 0,
    is_deleted TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY email (email)
) ENGINE=InnoDB;

-- Tour operators (businesses awaiting / holding verification)
CREATE TABLE IF NOT EXISTS operator (
    operator_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT NULL,
    business_name VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    state VARCHAR(50),
    eco_score INT DEFAULT 0,
    verification_status ENUM('pending', 'verified', 'rejected', 'flagged') DEFAULT 'pending',
    certification VARCHAR(100),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
) ENGINE=InnoDB;

-- Tours / listings. latitude & longitude feed the Leaflet map.
CREATE TABLE IF NOT EXISTS tour (
    tour_id INT AUTO_INCREMENT PRIMARY KEY,
    operator_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category ENUM('wildlife', 'jungle_trek', 'river_coast', 'birdwatching', 'community') NOT NULL,
    location VARCHAR(150),
    state VARCHAR(50),
    duration VARCHAR(20),
    group_size INT DEFAULT 8,
    difficulty ENUM('easy', 'moderate', 'challenging'),
    price DECIMAL(10,2) NOT NULL,
    eco_score INT DEFAULT 0,
    image_gradient VARCHAR(30) DEFAULT 'from-emerald-600 to-green-800',
    icon VARCHAR(50) DEFAULT 'fa-tree',
    image_url VARCHAR(255) DEFAULT NULL,
    latitude DECIMAL(9,6) DEFAULT NULL,
    longitude DECIMAL(9,6) DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operator(operator_id)
) ENGINE=InnoDB;

-- Conservation fund projects
CREATE TABLE IF NOT EXISTS conservation_fund (
    fund_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category ENUM('wildlife', 'community', 'reforestation') NOT NULL,
    description TEXT,
    allocation_pct DECIMAL(5,2) NOT NULL,
    target_amount DECIMAL(12,2),
    collected_amount DECIMAL(12,2) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Which tours pay into which funds, and at what percentage of the subtotal
CREATE TABLE IF NOT EXISTS tour_fund (
    tour_fund_id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT NOT NULL,
    fund_id INT NOT NULL,
    allocation_pct DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tour(tour_id),
    FOREIGN KEY (fund_id) REFERENCES conservation_fund(fund_id)
) ENGINE=InnoDB;

-- Bookings
CREATE TABLE IF NOT EXISTS booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tour_id INT NOT NULL,
    booking_ref VARCHAR(12) NOT NULL,
    booking_date DATE NOT NULL,
    participants INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    conservation_levy DECIMAL(10,2) NOT NULL,
    status ENUM('confirmed', 'completed', 'cancelled') DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY booking_ref (booking_ref),
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (tour_id) REFERENCES tour(tour_id)
) ENGINE=InnoDB;

-- Immutable per-fund transaction log (one row per fund per booking)
CREATE TABLE IF NOT EXISTS fund_ledger (
    ledger_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    fund_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
    FOREIGN KEY (fund_id) REFERENCES conservation_fund(fund_id)
) ENGINE=InnoDB;

-- Operator verification scoring criteria (admin configuration)
CREATE TABLE IF NOT EXISTS verification_criteria (
    criteria_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    data_source VARCHAR(100),
    is_automated TINYINT(1) DEFAULT 0
) ENGINE=InnoDB;
