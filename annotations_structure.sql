-- MySQL dump 10.13  Distrib 9.0.1, for macos14 (x86_64)
--
-- Host: localhost    Database: annotations
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (1,'Active Labor (5cm-8cm)','2024-11-08 07:17:03'),(2,'Pushing/Delivery','2024-11-08 07:17:03');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Datapoints`
--

DROP TABLE IF EXISTS `Datapoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
/* add(input type)*/
CREATE TABLE `Datapoints` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subcategory_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `data_type` varchar(255) NOT NULL,
  `is_mandatory` tinyint(1) DEFAULT '0',
  
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `datapoints_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `Subcategories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_subcategory` FOREIGN KEY (`subcategory_id`) REFERENCES `Subcategories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Datapoints`
--

LOCK TABLES `Datapoints` WRITE;
/*!40000 ALTER TABLE `Datapoints` DISABLE KEYS */;
INSERT INTO `Datapoints` VALUES (52,71,'HR','numeric',1,'2024-11-08 07:17:03'),(53,71,'Respirations','numeric',1,'2024-11-08 07:17:03'),(54,71,'Blood Pressure','numeric',1,'2024-11-08 07:17:03'),(55,71,'Pulse Ox','numeric',1,'2024-11-08 07:17:03'),(56,71,'Temperature','numeric',1,'2024-11-08 07:17:03'),(57,72,'Pain Level','list',0,'2024-11-08 07:17:03'),(58,73,'FHR Reading','numeric',1,'2024-11-08 07:17:03'),(59,74,'Contraction Frequency','numeric',1,'2024-11-08 07:17:03');
/*!40000 ALTER TABLE `Datapoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ListValues`
--

DROP TABLE IF EXISTS `ListValues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ListValues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `datapoint_id` int DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `datapoint_id` (`datapoint_id`),
  CONSTRAINT `listvalues_ibfk_1` FOREIGN KEY (`datapoint_id`) REFERENCES `Datapoints` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ListValues`
--

LOCK TABLES `ListValues` WRITE;
/*!40000 ALTER TABLE `ListValues` DISABLE KEYS */;
INSERT INTO `ListValues` VALUES (17,57,'Mild'),(18,57,'Moderate'),(19,57,'Severe');
/*!40000 ALTER TABLE `ListValues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PatientInformation`
--

DROP TABLE IF EXISTS `PatientInformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PatientInformation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `bed_number` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PatientInformation`
--

LOCK TABLES `PatientInformation` WRITE;
/*!40000 ALTER TABLE `PatientInformation` DISABLE KEYS */;
/*!40000 ALTER TABLE `PatientInformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Rules`
--

DROP TABLE IF EXISTS `Rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(255) NOT NULL,
  `condition_name` varchar(255) NOT NULL,
  `operator` enum('>=','<=','>','<','=','string_equals','contains','not_equals','does_not_contain') DEFAULT NULL,
  `value` varchar(255) NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rules`
--

LOCK TABLES `Rules` WRITE;
/*!40000 ALTER TABLE `Rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `Rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subcategories`
--

DROP TABLE IF EXISTS `Subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subcategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subcategories`
--

LOCK TABLES `Subcategories` WRITE;
/*!40000 ALTER TABLE `Subcategories` DISABLE KEYS */;
INSERT INTO `Subcategories` VALUES (71,1,'Vitals','2024-11-08 07:17:03'),(72,1,'Pain Management','2024-11-08 07:17:03'),(73,2,'FHR','2024-11-08 07:17:03'),(74,2,'Contractions','2024-11-08 07:17:03');
/*!40000 ALTER TABLE `Subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Symbols`
--

DROP TABLE IF EXISTS `Symbols`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Symbols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `symbol` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Symbols`
--

LOCK TABLES `Symbols` WRITE;
/*!40000 ALTER TABLE `Symbols` DISABLE KEYS */;
INSERT INTO `Symbols` VALUES (1,'<='),(2,'<'),(3,'>='),(4,'>'),(5,'='),(6,'!='),(7,'string_equals'),(8,'string_not_equals'),(9,'contains'),(10,'does_not_contains'),(11,'==');
/*!40000 ALTER TABLE `Symbols` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `Symbols`
--

DROP TABLE IF EXISTS `Symbols`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Symbols` (
  `id` int NOT NULL AUTO_INCREMENT,
  `symbol` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Symbols`
--

LOCK TABLES `Symbols` WRITE;
/*!40000 ALTER TABLE `Symbols` DISABLE KEYS */;
INSERT INTO `Symbols` VALUES (1,'<='),(2,'<'),(3,'>='),(4,'>'),(5,'='),(6,'!='),(7,'string_equals'),(8,'string_not_equals'),(9,'contains'),(10,'does_not_contains'),(11,'==');
/*!40000 ALTER TABLE `Symbols` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-20 14:31:33
