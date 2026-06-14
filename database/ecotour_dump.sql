-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: ecotour
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ecotour`
--

/*!40000 DROP DATABASE IF EXISTS `ecotour`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ecotour` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `ecotour`;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `booking_ref` varchar(12) NOT NULL,
  `booking_date` date NOT NULL,
  `participants` int(11) DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL,
  `conservation_levy` decimal(10,2) NOT NULL,
  `status` enum('confirmed','completed','cancelled') DEFAULT 'confirmed',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `booking_ref` (`booking_ref`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (1,1,2,'ECO-A3F8K2','2026-03-15',2,452.00,78.00,'completed','2026-06-12 22:42:02'),(2,1,6,'ECO-B7D2M9','2026-05-20',1,402.00,105.00,'completed','2026-06-12 22:42:02'),(3,2,1,'ECO-C1H4P6','2026-04-10',2,644.00,168.00,'completed','2026-06-12 22:42:02'),(4,1,1,'ECO-D9J3R7','2026-07-15',2,728.00,168.00,'confirmed','2026-06-12 22:42:02'),(5,1,3,'ECO-75BC94','2026-07-14',2,345.00,45.00,'confirmed','2026-06-14 19:13:02'),(6,1,3,'ECO-18929E','2026-07-20',2,345.00,45.00,'confirmed','2026-06-14 19:13:38');
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conservation_fund`
--

DROP TABLE IF EXISTS `conservation_fund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conservation_fund` (
  `fund_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` enum('wildlife','community','reforestation') NOT NULL,
  `description` text DEFAULT NULL,
  `allocation_pct` decimal(5,2) NOT NULL,
  `target_amount` decimal(12,2) DEFAULT NULL,
  `collected_amount` decimal(12,2) DEFAULT 0.00,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`fund_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conservation_fund`
--

LOCK TABLES `conservation_fund` WRITE;
/*!40000 ALTER TABLE `conservation_fund` DISABLE KEYS */;
INSERT INTO `conservation_fund` VALUES (1,'Sabah Wildlife Fund','wildlife','Supports orangutan rehabilitation and wildlife corridor protection in Sabah',15.00,400000.00,312060.00,1),(2,'Local Community Fund','community','Direct funding to Orang Asli and rural communities for sustainable development',10.00,300000.00,267000.00,1),(3,'Reforestation Malaysia','reforestation','Tree planting and forest restoration projects across Peninsular Malaysia',5.00,150000.00,89030.00,1);
/*!40000 ALTER TABLE `conservation_fund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fund_ledger`
--

DROP TABLE IF EXISTS `fund_ledger`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fund_ledger` (
  `ledger_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ledger_id`),
  KEY `booking_id` (`booking_id`),
  KEY `fund_id` (`fund_id`),
  CONSTRAINT `fund_ledger_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`booking_id`),
  CONSTRAINT `fund_ledger_ibfk_2` FOREIGN KEY (`fund_id`) REFERENCES `conservation_fund` (`fund_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fund_ledger`
--

LOCK TABLES `fund_ledger` WRITE;
/*!40000 ALTER TABLE `fund_ledger` DISABLE KEYS */;
INSERT INTO `fund_ledger` VALUES (1,1,2,40.80,'2026-06-12 22:42:02'),(2,1,3,37.20,'2026-06-12 22:42:02'),(3,2,1,52.50,'2026-06-12 22:42:02'),(4,2,2,28.00,'2026-06-12 22:42:02'),(5,2,3,24.50,'2026-06-12 22:42:02'),(6,3,1,84.00,'2026-06-12 22:42:02'),(7,3,2,56.00,'2026-06-12 22:42:02'),(8,3,3,28.00,'2026-06-12 22:42:02'),(9,4,1,84.00,'2026-06-12 22:42:02'),(10,4,2,56.00,'2026-06-12 22:42:02'),(11,4,3,28.00,'2026-06-12 22:42:02'),(12,5,1,30.00,'2026-06-14 19:13:02'),(13,5,3,15.00,'2026-06-14 19:13:02'),(14,6,1,30.00,'2026-06-14 19:13:38'),(15,6,3,15.00,'2026-06-14 19:13:38');
/*!40000 ALTER TABLE `fund_ledger` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operator`
--

DROP TABLE IF EXISTS `operator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operator` (
  `operator_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `business_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `eco_score` int(11) DEFAULT 0,
  `verification_status` enum('pending','verified','rejected','flagged') DEFAULT 'pending',
  `certification` varchar(100) DEFAULT NULL,
  `submitted_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`operator_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `operator_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operator`
--

LOCK TABLES `operator` WRITE;
/*!40000 ALTER TABLE `operator` DISABLE KEYS */;
INSERT INTO `operator` VALUES (1,3,'Borneo Naturalist Expeditions','Certified eco-tour operator specializing in wildlife encounters and canopy treks in Sabah conservation areas.','Danum Valley','Sabah',94,'verified','MyEcoCert L3','2026-06-12 22:42:02'),(2,4,'Taman Negara Eco Adventures','Community-based eco-tourism working with Orang Asli villages in Taman Negara.','Kuala Tahan','Pahang',87,'verified','MyEcoCert L2','2026-06-12 22:42:02'),(3,NULL,'Kelantan River Eco Tours','River-based eco-tours along Kelantan waterways with community guides.','Kota Bharu','Kelantan',76,'pending',NULL,'2026-06-12 22:42:02'),(4,NULL,'Green Tiger Adventures','Adventure tourism operator ÔÇö under review for greenwashing concerns.','Kuching','Sarawak',41,'flagged',NULL,'2026-06-12 22:42:02');
/*!40000 ALTER TABLE `operator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour`
--

DROP TABLE IF EXISTS `tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tour` (
  `tour_id` int(11) NOT NULL AUTO_INCREMENT,
  `operator_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` enum('wildlife','jungle_trek','river_coast','birdwatching','community') NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `group_size` int(11) DEFAULT 8,
  `difficulty` enum('easy','moderate','challenging') DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `eco_score` int(11) DEFAULT 0,
  `image_gradient` varchar(30) DEFAULT 'from-emerald-600 to-green-800',
  `icon` varchar(50) DEFAULT 'fa-tree',
  `image_url` varchar(255) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`tour_id`),
  KEY `operator_id` (`operator_id`),
  CONSTRAINT `tour_ibfk_1` FOREIGN KEY (`operator_id`) REFERENCES `operator` (`operator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour`
--

LOCK TABLES `tour` WRITE;
/*!40000 ALTER TABLE `tour` DISABLE KEYS */;
INSERT INTO `tour` VALUES (1,1,'Orangutan Canopy Trek','An immersive 2-day canopy walk and wildlife encounter at Danum Valley. Led by certified naturalists, directly funds Sabah Wildlife rehabilitation.','wildlife','Danum Valley','Sabah','2D / 1N',8,'moderate',280.00,94,'from-emerald-600 to-green-800','fa-tree','https://commons.wikimedia.org/wiki/Special:FilePath/Pongo_pygmaeus_(orangutang).jpg?width=800',4.960000,117.800000,1,'2026-06-12 22:42:02'),(2,2,'Orang Asli Village Stay','Authentic cultural immersion with indigenous communities deep in Taman Negara rainforest.','community','Taman Negara','Pahang','3D / 2N',6,'easy',195.00,87,'from-amber-600 to-orange-800','fa-campground','https://commons.wikimedia.org/wiki/Special:FilePath/Korbu_Asli_Village.JPG?width=800',4.383000,102.400000,1,'2026-06-12 22:42:02'),(3,1,'Waterfall Rainforest Trail','Trek through ancient rainforests to hidden waterfalls and natural pools in Endau-Rompin.','jungle_trek','Endau-Rompin','Johor','1D',10,'moderate',150.00,82,'from-blue-600 to-cyan-800','fa-water','https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=70',2.530000,103.320000,1,'2026-06-12 22:42:02'),(4,3,'Kelantan Mangrove Kayak','Paddle through mangrove forests with community guides. Supports local conservation projects.','river_coast','Kota Bharu','Kelantan','Half Day',4,'easy',90.00,76,'from-emerald-600 to-teal-800','fa-boat','https://commons.wikimedia.org/wiki/Special:FilePath/Mangroves_(53575624549).jpg?width=800',6.130000,102.240000,1,'2026-06-12 22:42:02'),(5,1,'Sarawak Hornbill Watch','Guided birdwatching expedition in Miri featuring rare hornbill species and tropical birds.','birdwatching','Miri','Sarawak','1D',6,'easy',120.00,88,'from-amber-600 to-yellow-800','fa-binoculars','https://commons.wikimedia.org/wiki/Special:FilePath/Hornbill_on_Gunung_Palung_National_Park.jpg?width=800',4.400000,113.990000,1,'2026-06-12 22:42:02'),(6,2,'Turtle Island Conservation','Overnight conservation experience at turtle nesting sites. Directly supports marine conservation.','wildlife','Perhentian Islands','Terengganu','2D / 1N',12,'easy',350.00,91,'from-cyan-600 to-blue-800','fa-fish','https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=70',5.920000,102.740000,1,'2026-06-12 22:42:02');
/*!40000 ALTER TABLE `tour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_fund`
--

DROP TABLE IF EXISTS `tour_fund`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tour_fund` (
  `tour_fund_id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `fund_id` int(11) NOT NULL,
  `allocation_pct` decimal(5,2) NOT NULL,
  PRIMARY KEY (`tour_fund_id`),
  KEY `tour_id` (`tour_id`),
  KEY `fund_id` (`fund_id`),
  CONSTRAINT `tour_fund_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tour` (`tour_id`),
  CONSTRAINT `tour_fund_ibfk_2` FOREIGN KEY (`fund_id`) REFERENCES `conservation_fund` (`fund_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_fund`
--

LOCK TABLES `tour_fund` WRITE;
/*!40000 ALTER TABLE `tour_fund` DISABLE KEYS */;
INSERT INTO `tour_fund` VALUES (1,1,1,15.00),(2,1,2,10.00),(3,1,3,5.00),(4,2,2,12.00),(5,2,3,8.00),(6,3,1,10.00),(7,3,3,5.00),(8,4,2,10.00),(9,4,3,5.00),(10,5,1,10.00),(11,5,2,5.00),(12,6,1,15.00),(13,6,2,8.00),(14,6,3,5.00);
/*!40000 ALTER TABLE `tour_fund` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('traveler','operator','admin') DEFAULT 'traveler',
  `eco_score` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Ahmad Rezza','rezza@ecotour.my','$2y$10$Io9v1ciQ47gpLeUoynIcnuRr37QafGyK7tkNsXfjcSefPZ9JmXaNK','traveler',892,0,'2026-06-12 22:42:02'),(2,'Nurin Sofiya','nurin@ecotour.my','$2y$10$Io9v1ciQ47gpLeUoynIcnuRr37QafGyK7tkNsXfjcSefPZ9JmXaNK','traveler',450,0,'2026-06-12 22:42:02'),(3,'Hafidzul Rahman','hafidzul@ecotour.my','$2y$10$Io9v1ciQ47gpLeUoynIcnuRr37QafGyK7tkNsXfjcSefPZ9JmXaNK','operator',0,0,'2026-06-12 22:42:02'),(4,'Muaz Fahmi','muaz@ecotour.my','$2y$10$Io9v1ciQ47gpLeUoynIcnuRr37QafGyK7tkNsXfjcSefPZ9JmXaNK','operator',0,0,'2026-06-12 22:42:02'),(5,'Admin EcoTour','admin@ecotour.my','$2y$10$Io9v1ciQ47gpLeUoynIcnuRr37QafGyK7tkNsXfjcSefPZ9JmXaNK','admin',0,0,'2026-06-12 22:42:02');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_criteria`
--

DROP TABLE IF EXISTS `verification_criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification_criteria` (
  `criteria_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `data_source` varchar(100) DEFAULT NULL,
  `is_automated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`criteria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_criteria`
--

LOCK TABLES `verification_criteria` WRITE;
/*!40000 ALTER TABLE `verification_criteria` DISABLE KEYS */;
INSERT INTO `verification_criteria` VALUES (1,'Wildlife Disturbance Protocol',15.00,'DOE Permit',1),(2,'Renewable Energy Usage',12.00,'TNB/SEDA cert',1),(3,'Local Guide Employment',10.00,'Self-declared + audit',0),(4,'Community Revenue Share',10.00,'Ledger data',1),(5,'Plastic-Free Operations',8.00,'On-site audit',0);
/*!40000 ALTER TABLE `verification_criteria` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-14 22:33:04
