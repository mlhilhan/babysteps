CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."health_note_type" AS ENUM('medication', 'doctor_visit', 'allergy', 'illness', 'general');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('photo', 'video', 'text');--> statement-breakpoint
CREATE TYPE "public"."milestone_category" AS ENUM('motor', 'language', 'social', 'cognitive');--> statement-breakpoint
CREATE TYPE "public"."nutrition_type" AS ENUM('breastfeeding', 'formula', 'solid_food', 'snack', 'water');--> statement-breakpoint
CREATE TYPE "public"."permission" AS ENUM('view', 'edit', 'admin');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'premium', 'premium_plus');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."sleep_quality" AS ENUM('poor', 'fair', 'good', 'excellent');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "childProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"dateOfBirth" date NOT NULL,
	"gender" "gender" NOT NULL,
	"photoUrl" text,
	"bloodType" varchar(10),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "developmentalMilestones" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"category" "milestone_category" NOT NULL,
	"milestone" varchar(255) NOT NULL,
	"expectedAgeMonths" integer NOT NULL,
	"achieved" boolean DEFAULT false NOT NULL,
	"achievedDate" date,
	"photoUrl" text,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "familySharing" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"ownerUserId" integer NOT NULL,
	"sharedWithUserId" integer NOT NULL,
	"permission" "permission" DEFAULT 'view' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "growthMeasurements" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"height" numeric(5, 2) NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"headCircumference" numeric(5, 2),
	"measurementDate" date NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "healthNotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"type" "health_note_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"medicationName" varchar(255),
	"dosage" varchar(100),
	"frequency" varchar(100),
	"startDate" date,
	"endDate" date,
	"doctorName" varchar(255),
	"clinic" varchar(255),
	"noteDate" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memoryJournal" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"mediaUrl" text,
	"mediaType" "media_type" NOT NULL,
	"tags" varchar(500),
	"journalDate" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutritionLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"logDate" date NOT NULL,
	"type" "nutrition_type" NOT NULL,
	"description" varchar(255) NOT NULL,
	"duration" integer,
	"quantity" varchar(100),
	"time" varchar(10),
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sleepLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"sleepDate" date NOT NULL,
	"startTime" varchar(10) NOT NULL,
	"endTime" varchar(10) NOT NULL,
	"duration" integer NOT NULL,
	"quality" "sleep_quality" DEFAULT 'good' NOT NULL,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"startDate" date NOT NULL,
	"endDate" date,
	"autoRenew" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "vaccinationSchedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"childId" integer NOT NULL,
	"vaccineName" varchar(255) NOT NULL,
	"recommendedAgeMonths" integer NOT NULL,
	"scheduledDate" date,
	"administeredDate" date,
	"administered" boolean DEFAULT false NOT NULL,
	"doctorName" varchar(255),
	"clinic" varchar(255),
	"batchNumber" varchar(255),
	"sideEffects" text,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
