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
  `bevestigd` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aanmelders`
--

LOCK TABLES `aanmelders` WRITE;
/*!40000 ALTER TABLE `aanmelders` DISABLE KEYS */;
INSERT INTO `aanmelders` VALUES (7,'Felix Warners','ffwarners@gmail.com','man','1986-02-16','06-12345678','dutch','Tignanello 2013',16,'true'),(8,'Thijs Nederlof','pnede3@gmail.com','man','1998-05-02','06-87654321','german','Nicolas Catena Zapata 2011',17,'true'),(9,'Jeroen Nelen','jwnelen@gmail.com','man','1997-10-29','06-19283765','french','Grande opening',15,'true'),(13,'Felix Warners','stevenlambregts@home.nl','man','0002-02-22','06123456789','dutch','Nicolas Catena Zapata 2011',17,'true'),(14,'Steven Lambregts','stevenlambregts@gmail.com','man','1998-10-22','683400373','dutch','Grande opening',15,'true'),(15,'Fred van Leer','fredvanleer@gmail.com','man','2000-04-02','06-12345678','dutch','Nicolas Catena Zapata 2011',17,'false');
/*!40000 ALTER TABLE `aanmelders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personName` text,
  `proeverijName` text,
  `reaction` text,
  `proeverijDate` text,
  `reactionDate` text,
  `rate` int(11) DEFAULT NULL,
  `approved` text,
  `proeverijBeschrijving` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,'nep',NULL,NULL,NULL,NULL,6,'true',NULL),(5,'Bennie Stout','Nicolas Catena Zapata 2011','DIT IS EEN FAKETEKST. ALLES WAT HIER STAAT IS SLECHTS OM EEN INDRUK TE GEVEN VAN HET GRAFISCHE EFFECT VAN TEKST OP DEZE PLEK. WAT U HIER LEEST IS EEN VOORBEELDTEKST. DEZE WORDT LATER VERVANGEN DOOR DE UITEINDELIJKE TEKST, DIE NU NOG NIET BEKEND IS. DE FAKETEKST IS DUS EEN TEKST DIE EIGENLIJK NERGENS OVER GAAT. HET GRAPPIGE IS, DAT MENSEN DEZE TOCH VAAK LEZEN. ZELFS ALS MEN WEET DAT HET OM EEN FAKETEKST GAAT, LEZEN ZE TOCH DOOR.','2018-02-02','Mon Jul 31 2017',5,'true','Dit is de absolute top van Argentijns rood. De wijn is gemaakt van handgeplukte cabernet sauvignon aangevuld met malbec. De Nicolas Catena Zapata rijpt eerst 24 maanden op Frans eiken en daarna nog eens 24 maanden op fles in de bodega. Pas dan komt de wijn op de markt, maar het is het wachten waard! Het resultaat is een wijn die zich kan meten met ’s werelds beste Bordeaux blends. In blind proeverijen gooit deze nieuwe wereld wijn met een klassieke twist altijd hoge ogen!'),(6,'Thijs Nederlof','Oma\'s champagne','Er is een snelle toetscombinatie om in Word woorden te wisselen van kleine letters naar hoofdletters en andersom; selecteer het hele woord > Shift+F3. Je kunt ook meteen een beginhoofletter maken; ga ín het woord staan en druk op Shift+F3.','2016-12-02','Fri Aug 04 2017',3,'true','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.'),(7,'Ollie Rover','Neppe proeverij','ER IS EEN SNELLE TOETSCOMBINATIE OM IN WORD WOORDEN TE WISSELEN VAN KLEINE LETTERS NAAR HOOFDLETTERS EN ANDERSOM; SELECTEER HET HELE WOORD > SHIFT+F3. JE KUNT OOK METEEN EEN BEGINHOOFLETTER MAKEN; GA ÍN HET WOORD STAAN EN DRUK OP SHIFT+F3.','2017-05-12','Won Feb 06 2017',1,'true','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.'),(9,'Man de Rijn','Nicolas Catena Zapata 2011','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.','2017-01-08','Zat Okt 22 2017',5,'true','Dit is de absolute top van Argentijns rood. De wijn is gemaakt van handgeplukte cabernet sauvignon aangevuld met malbec. De Nicolas Catena Zapata rijpt eerst 24 maanden op Frans eiken en daarna nog eens 24 maanden op fles in de bodega. Pas dan komt de wijn op de markt, maar het is het wachten waard! Het resultaat is een wijn die zich kan meten met ’s werelds beste Bordeaux blends. In blind proeverijen gooit deze nieuwe wereld wijn met een klassieke twist altijd hoge ogen!'),(10,'Achmed de Boom','Fake Proeverij','EEN MENING ONTSTAAT OP BASIS VAN EIGEN ERVARING EN KENNIS BINNEN DE CONTEXT VAN EIGEN SOCIALE OMGEVING EN KARAKTER EN IS EEN GEVOLG VAN COGNITIEF DENKEN, WAARDOOR HET ALTIJD GEVORMD IS DOOR INDIVIDUELE STANDPUNTEN DIE BEÏNVLOED ZIJN DOOR WAT ER BINNEN DE SAMENLEVING GELDIG IS. MEESTAL KOMT HIER ETHIEK BIJ KIJKEN. IN DE POLITIEK WORDT HET UITWISSELEN VAN VERSCHILLENDE MENINGEN EN OPVATTINGEN EEN DEBAT GENOEMD. WAARBIJ UITEINDELIJK GELDT DAT DE MENING MET DE MEESTE AANHANGERS WINT.','2015-01-31','Fri Aug 04 2017',4,'true','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.'),(12,'Thijs Nederlof','Nicolas Catena Zapata 2011','Een mening ontstaat op basis van eigen ervaring en kennis binnen de context van eigen sociale omgeving en karakter en is een gevolg van cognitief denken, waardoor het altijd gevormd is door individuele standpunten die beïnvloed zijn door wat er binnen de samenleving geldig is. Meestal komt hier ethiek bij kijken. In de politiek wordt het uitwisselen van verschillende meningen en opvattingen een debat genoemd. Waarbij uiteindelijk geldt dat de mening met de meeste aanhangers wint.','2018-02-02','Sat Aug 05 2017',5,'true','Dit is de absolute top van Argentijns rood. De wijn is gemaakt van handgeplukte cabernet sauvignon aangevuld met malbec. De Nicolas Catena Zapata rijpt eerst 24 maanden op Frans eiken en daarna nog eens 24 maanden op fles in de bodega. Pas dan komt de wijn op de markt, maar het is het wachten waard! Het resultaat is een wijn die zich kan meten met ’s werelds beste Bordeaux blends. In blind proeverijen gooit deze nieuwe wereld wijn met een klassieke twist altijd hoge ogen!');
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proeverijen`
--

LOCK TABLES `proeverijen` WRITE;
/*!40000 ALTER TABLE `proeverijen` DISABLE KEYS */;
INSERT INTO `proeverijen` VALUES (15,'Grande opening','2017-12-31','Dit is een faketekst. Alles wat hier staat is slechts om een indruk te geven van het grafische effect van tekst op deze plek. Wat u hier leest is een voorbeeldtekst. Deze wordt later vervangen door de uiteindelijke tekst, die nu nog niet bekend is. De faketekst is dus een tekst die eigenlijk nergens over gaat. Het grappige is, dat mensen deze toch vaak lezen. Zelfs als men weet dat het om een faketekst gaat, lezen ze toch door.','true'),(16,'Tignanello 2013','2018-10-22','Tignanello is de naam van de heuvel die bekend staat als een van de hoogste en meest pittoreske plaatsen van heel Toscane. Het domein met dezelfde naam is in handen van de wijnfamilie Antinori. Deze wijn wordt gemaakt van 80%Sangiovese met 15%rnet Sauvignon en 5%rnet Franc. Hij is complex en perfect in balans. Je proeft rood fruit, zoethout en chocola. Schenk deze Toscaanse topwijn in combinatie met everzwijn of ander groot wild.','false'),(17,'Nicolas Catena Zapata 2011','2018-02-02','Dit is de absolute top van Argentijns rood. De wijn is gemaakt van handgeplukte cabernet sauvignon aangevuld met malbec. De Nicolas Catena Zapata rijpt eerst 24 maanden op Frans eiken en daarna nog eens 24 maanden op fles in de bodega. Pas dan komt de wijn op de markt, maar het is het wachten waard! Het resultaat is een wijn die zich kan meten met ’s werelds beste Bordeaux blends. In blind proeverijen gooit deze nieuwe wereld wijn met een klassieke twist altijd hoge ogen!','true');
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
  `imageExt` text,
  `Wijnoogst` text,
  `producent` text,
  `wijngaard` text,
  `predikat` text,
  `naam` text,
  `smaak` text,
  `droog` text,
  `inhoud` text,
  `aankoop prijs` text,
  PRIMARY KEY (`wine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wines`
--

LOCK TABLES `wines` WRITE;
/*!40000 ALTER TABLE `wines` DISABLE KEYS */;
INSERT INTO `wines` VALUES (1,'jpg','2015','Reinhold Haart','Piesporter Goldtröpfchen','Kabinett','Wijn 1','Riesling','false','0.75','15'),(2,'jpg','2016','Keller','home','','von der Fels','Riesling','true','0.75','10'),(3,'jpg','2001','Test',NULL,NULL,'Wijn 2',NULL,'false','2','230'),(4,'jpg','1950','Steven','',NULL,'Wijn 3','','false','1.5',NULL),(5,'jpg','2004','Achmed','',NULL,'Qijn 4',NULL,'false','3',NULL),(6,'jpg','2017','Malbec','Alamos','Mountain','Alamos Malbec','Bramen, krachtig en licht kruidig','true','0,75CL','€5,99');
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

-- Dump completed on 2017-12-23 11:58:47
