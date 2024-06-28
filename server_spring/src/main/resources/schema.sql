DROP TABLE IF EXISTS `banners`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `orderedseats`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `seats`;
DROP TABLE IF EXISTS `carriages`;
DROP TABLE IF EXISTS `scheduleprices`;
DROP TABLE IF EXISTS `schedules`;
DROP TABLE IF EXISTS `trains`;
DROP TABLE IF EXISTS `scheduledays`;
DROP TABLE IF EXISTS `stations`;
DROP TABLE IF EXISTS `emailtokens`;
DROP TABLE IF EXISTS `passengers`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE `passengers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `isUser` tinyint(1) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `dateOfBirth` datetime NOT NULL,
  `idCard` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `passengers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `emailtokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiredAt` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE `stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB;

CREATE TABLE `scheduledays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `departureStationId` int(11) NOT NULL,
  `arrivalStationId` int(11) NOT NULL,
  `departureTime` time NOT NULL,
  `arrivalTime` time NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `departureStationId` (`departureStationId`),
  KEY `arrivalStationId` (`arrivalStationId`),
  CONSTRAINT `scheduledays_ibfk_1` FOREIGN KEY (`departureStationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scheduledays_ibfk_2` FOREIGN KEY (`arrivalStationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `trains` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB;

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trainId` int(11) DEFAULT NULL,
  `departureStationId` int(11) DEFAULT NULL,
  `arrivalStationId` int(11) DEFAULT NULL,
  `departureTime` datetime DEFAULT NULL,
  `arrivalTime` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainId` (`trainId`),
  KEY `departureStationId` (`departureStationId`),
  KEY `arrivalStationId` (`arrivalStationId`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`trainId`) REFERENCES `trains` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`departureStationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`arrivalStationId`) REFERENCES `stations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `scheduleprices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `scheduleId` int(11) NOT NULL,
  `seatClass` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `scheduleId` (`scheduleId`),
  CONSTRAINT `scheduleprices_ibfk_1` FOREIGN KEY (`scheduleId`) REFERENCES `schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `carriages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trainId` int(11) DEFAULT NULL,
  `carriageNumber` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `trainId` (`trainId`),
  CONSTRAINT `carriages_ibfk_1` FOREIGN KEY (`trainId`) REFERENCES `trains` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `seats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carriageId` int(11) DEFAULT NULL,
  `seatNumber` varchar(255) NOT NULL,
  `seatClass` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `carriageId` (`carriageId`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`carriageId`) REFERENCES `carriages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `scheduleId` int(11) DEFAULT NULL,
  `isNotified` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `scheduleId` (`scheduleId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`scheduleId`) REFERENCES `schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `orderedseats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `seatId` int(11) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `dateOfBirth` datetime NOT NULL,
  `idCard` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `secret` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `seatId` (`seatId`),
  CONSTRAINT `orderedseats_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orderedseats_ibfk_2` FOREIGN KEY (`seatId`) REFERENCES `seats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `isPaid` tinyint(1) NOT NULL,
  `duePayment` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `imageDesktop` varchar(255) NOT NULL,
  `imageMobile` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;