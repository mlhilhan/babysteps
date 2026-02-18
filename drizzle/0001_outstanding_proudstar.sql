CREATE TABLE `childProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`dateOfBirth` date NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`photoUrl` text,
	`bloodType` varchar(10),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `childProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `developmentalMilestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`category` enum('motor','language','social','cognitive') NOT NULL,
	`milestone` varchar(255) NOT NULL,
	`expectedAgeMonths` int NOT NULL,
	`achieved` boolean NOT NULL DEFAULT false,
	`achievedDate` date,
	`photoUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `developmentalMilestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `familySharing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`ownerUserId` int NOT NULL,
	`sharedWithUserId` int NOT NULL,
	`permission` enum('view','edit','admin') NOT NULL DEFAULT 'view',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `familySharing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `growthMeasurements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`height` decimal(5,2) NOT NULL,
	`weight` decimal(5,2) NOT NULL,
	`headCircumference` decimal(5,2),
	`measurementDate` date NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `growthMeasurements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`type` enum('medication','doctor_visit','allergy','illness','general') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`medicationName` varchar(255),
	`dosage` varchar(100),
	`frequency` varchar(100),
	`startDate` date,
	`endDate` date,
	`doctorName` varchar(255),
	`clinic` varchar(255),
	`noteDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `healthNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `memoryJournal` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`mediaUrl` text,
	`mediaType` enum('photo','video','text') NOT NULL,
	`tags` varchar(500),
	`journalDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `memoryJournal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutritionLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`logDate` date NOT NULL,
	`type` enum('breastfeeding','formula','solid_food','snack','water') NOT NULL,
	`description` varchar(255) NOT NULL,
	`duration` int,
	`quantity` varchar(100),
	`time` varchar(10),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nutritionLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sleepLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`sleepDate` date NOT NULL,
	`startTime` varchar(10) NOT NULL,
	`endTime` varchar(10) NOT NULL,
	`duration` int NOT NULL,
	`quality` enum('poor','fair','good','excellent') NOT NULL DEFAULT 'good',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sleepLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('free','premium','premium_plus') NOT NULL DEFAULT 'free',
	`status` enum('active','cancelled','expired') NOT NULL DEFAULT 'active',
	`startDate` date NOT NULL,
	`endDate` date,
	`autoRenew` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccinationSchedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childId` int NOT NULL,
	`vaccineName` varchar(255) NOT NULL,
	`recommendedAgeMonths` int NOT NULL,
	`scheduledDate` date,
	`administeredDate` date,
	`administered` boolean NOT NULL DEFAULT false,
	`doctorName` varchar(255),
	`clinic` varchar(255),
	`batchNumber` varchar(255),
	`sideEffects` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaccinationSchedule_id` PRIMARY KEY(`id`)
);
