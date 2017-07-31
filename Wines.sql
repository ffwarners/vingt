-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: wines
-- ------------------------------------------------------
-- Server version	5.7.18-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aanmelders`
--

DROP TABLE IF EXISTS `aanmelders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aanmelders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `email` text,
  `gender` text,
  `birthdate` text,
  `telephone` text,
  `language` text,
  `proeverijName` text,
  `proeverijID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aanmelders`
--

LOCK TABLES `aanmelders` WRITE;
/*!40000 ALTER TABLE `aanmelders` DISABLE KEYS */;
INSERT INTO `aanmelders` VALUES (1,'Felix Warners','ffwarners@gmail.com','man','1986-02-16','06-12345678','Dutch','opa',1),(8,'Steven Lambregts','stevenlambregts@gmail.com','man','1998-10-22','06-123456789','Dutch','opa',1),(9,'Steven Lambregts','stevenlambregts@gmail.com','man','1998-10-22','06-123456789','Dutch','volgende foto',6);
/*!40000 ALTER TABLE `aanmelders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producers`
--

DROP TABLE IF EXISTS `producers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producers` (
  `producer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `producer` varchar(60) NOT NULL,
  `country` varchar(60) DEFAULT NULL,
  `area` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`producer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producers`
--

LOCK TABLES `producers` WRITE;
/*!40000 ALTER TABLE `producers` DISABLE KEYS */;
INSERT INTO `producers` VALUES (1,'Reinhold Haart','Germany','Mosel'),(2,'Forstmeister-Geltz Zilliken','Germany','Mosel'),(3,'A.J. Adam','Germany','Mosel'),(4,'Julian Haart','Germany','Mosel'),(5,'Keller','Germany','Rheinhessen'),(6,'Kühling-Gillot','Germany','Rheinhessen'),(7,'Battenfeld Spanier','Germany','Rheinhessen'),(8,'Schäfer-Fröhlich','Germany','Nahe'),(9,'Emrich-Schönleber','Germany','Nahe');
/*!40000 ALTER TABLE `producers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proeverijen`
--

DROP TABLE IF EXISTS `proeverijen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proeverijen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text,
  `date` text,
  `details` text,
  `shown` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proeverijen`
--

LOCK TABLES `proeverijen` WRITE;
/*!40000 ALTER TABLE `proeverijen` DISABLE KEYS */;
INSERT INTO `proeverijen` VALUES (1,'opa','2222-02-22','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.','true'),(2,'Hidden proeverij','2017-07-13','Deze zou verborgen moeten zijn','true'),(3,'Eerste proeverij ooit','2014-12-01','Gezellig bij Felix thuis','true'),(4,'test','2017-02-02','Wijn drinken','true'),(5,'Nieuwe proeverij','1998-10-22','Even kijken wat deze afbeelding is','true'),(6,'volgende foto','1998-05-12','Details volgen nog','true');
/*!40000 ALTER TABLE `proeverijen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `name` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'steven','$2a$10$DVR/Wej9SvBBGSCx55bq8eLZJ3qbxU3vk96...DdvcIZsRWkUlei.','Steven'),(2,'Felix','$2a$10$DVR/Wej9SvBBGSCx55bq8eLZJ3qbxU3vk96...DdvcIZsRWkUlei.','Felix Warners');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wijnkaart`
--

DROP TABLE IF EXISTS `wijnkaart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wijnkaart` (
  `wine_id` int(11) NOT NULL,
  `bottle_price` float DEFAULT NULL,
  `glass_price` float DEFAULT NULL,
  PRIMARY KEY (`wine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wijnkaart`
--

LOCK TABLES `wijnkaart` WRITE;
/*!40000 ALTER TABLE `wijnkaart` DISABLE KEYS */;
INSERT INTO `wijnkaart` VALUES (1,30,6),(2,30,6);
/*!40000 ALTER TABLE `wijnkaart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wines`
--

DROP TABLE IF EXISTS `wines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wines` (
  `wine_id` int(11) NOT NULL AUTO_INCREMENT,
  `vintage` text,
  `producer` text,
  `vineyard` text,
  `predikat` text,
  `name` text,
  `grapes` text,
  `trocken` text,
  `size` text,
  `purchase price` text,
  PRIMARY KEY (`wine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wines`
--

LOCK TABLES `wines` WRITE;
/*!40000 ALTER TABLE `wines` DISABLE KEYS */;
INSERT INTO `wines` VALUES (1,'2015','Reinhold Haart','Piesporter Goldtröpfchen','Kabinett',NULL,'Riesling','N','0.75',''),(2,'2016','Keller','home','','von der Fels','Riesling','Y','0.75',NULL);
/*!40000 ALTER TABLE `wines` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-31 19:00:59
