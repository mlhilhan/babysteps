import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
  boolean,
  date,
  serial,
} from "drizzle-orm/pg-core";

// Enums (PostgreSQL requires separate type definitions)
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const milestoneCategoryEnum = pgEnum("milestone_category", [
  "motor",
  "language",
  "social",
  "cognitive",
]);
export const nutritionTypeEnum = pgEnum("nutrition_type", [
  "breastfeeding",
  "formula",
  "solid_food",
  "snack",
  "water",
]);
export const sleepQualityEnum = pgEnum("sleep_quality", [
  "poor",
  "fair",
  "good",
  "excellent",
]);
export const healthNoteTypeEnum = pgEnum("health_note_type", [
  "medication",
  "doctor_visit",
  "allergy",
  "illness",
  "general",
]);
export const mediaTypeEnum = pgEnum("media_type", ["photo", "video", "text"]);
export const planEnum = pgEnum("plan", ["free", "premium", "premium_plus"]);
export const statusEnum = pgEnum("status", ["active", "cancelled", "expired"]);
export const permissionEnum = pgEnum("permission", ["view", "edit", "admin"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Child Profiles - Her çocuğun temel bilgileri
 */
export const childProfiles = pgTable("childProfiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateOfBirth: date("dateOfBirth").notNull(),
  gender: genderEnum("gender").notNull(),
  photoUrl: text("photoUrl"),
  bloodType: varchar("bloodType", { length: 10 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type ChildProfile = typeof childProfiles.$inferSelect;
export type InsertChildProfile = typeof childProfiles.$inferInsert;

/**
 * Growth Measurements - Boy ve kilo takibi
 */
export const growthMeasurements = pgTable("growthMeasurements", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  height: numeric("height", { precision: 5, scale: 2 }).notNull(),
  weight: numeric("weight", { precision: 5, scale: 2 }).notNull(),
  headCircumference: numeric("headCircumference", { precision: 5, scale: 2 }),
  measurementDate: date("measurementDate").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GrowthMeasurement = typeof growthMeasurements.$inferSelect;
export type InsertGrowthMeasurement = typeof growthMeasurements.$inferInsert;

/**
 * Developmental Milestones - Gelişim kilometre taşları
 */
export const developmentalMilestones = pgTable("developmentalMilestones", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  category: milestoneCategoryEnum("category").notNull(),
  milestone: varchar("milestone", { length: 255 }).notNull(),
  expectedAgeMonths: integer("expectedAgeMonths").notNull(),
  achieved: boolean("achieved").default(false).notNull(),
  achievedDate: date("achievedDate"),
  photoUrl: text("photoUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type DevelopmentalMilestone = typeof developmentalMilestones.$inferSelect;
export type InsertDevelopmentalMilestone = typeof developmentalMilestones.$inferInsert;

/**
 * Vaccination Schedule - Aşı takvimi
 */
export const vaccinationSchedule = pgTable("vaccinationSchedule", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  vaccineName: varchar("vaccineName", { length: 255 }).notNull(),
  recommendedAgeMonths: integer("recommendedAgeMonths").notNull(),
  scheduledDate: date("scheduledDate"),
  administeredDate: date("administeredDate"),
  administered: boolean("administered").default(false).notNull(),
  doctorName: varchar("doctorName", { length: 255 }),
  clinic: varchar("clinic", { length: 255 }),
  batchNumber: varchar("batchNumber", { length: 255 }),
  sideEffects: text("sideEffects"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type VaccinationSchedule = typeof vaccinationSchedule.$inferSelect;
export type InsertVaccinationSchedule = typeof vaccinationSchedule.$inferInsert;

/**
 * Nutrition Log - Beslenme günlüğü
 */
export const nutritionLog = pgTable("nutritionLog", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  logDate: date("logDate").notNull(),
  type: nutritionTypeEnum("type").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  duration: integer("duration"),
  quantity: varchar("quantity", { length: 100 }),
  time: varchar("time", { length: 10 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NutritionLog = typeof nutritionLog.$inferSelect;
export type InsertNutritionLog = typeof nutritionLog.$inferInsert;

/**
 * Sleep Log - Uyku takibi
 */
export const sleepLog = pgTable("sleepLog", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  sleepDate: date("sleepDate").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(),
  endTime: varchar("endTime", { length: 10 }).notNull(),
  duration: integer("duration").notNull(),
  quality: sleepQualityEnum("quality").default("good").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SleepLog = typeof sleepLog.$inferSelect;
export type InsertSleepLog = typeof sleepLog.$inferInsert;

/**
 * Health Notes - Sağlık notları ve ilaç hatırlatıcıları
 */
export const healthNotes = pgTable("healthNotes", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  type: healthNoteTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  medicationName: varchar("medicationName", { length: 255 }),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  doctorName: varchar("doctorName", { length: 255 }),
  clinic: varchar("clinic", { length: 255 }),
  noteDate: date("noteDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type HealthNote = typeof healthNotes.$inferSelect;
export type InsertHealthNote = typeof healthNotes.$inferInsert;

/**
 * Memory Journal - Anı defteri (fotoğraf ve yazılar)
 */
export const memoryJournal = pgTable("memoryJournal", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mediaUrl: text("mediaUrl"),
  mediaType: mediaTypeEnum("mediaType").notNull(),
  tags: varchar("tags", { length: 500 }),
  journalDate: date("journalDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type MemoryJournal = typeof memoryJournal.$inferSelect;
export type InsertMemoryJournal = typeof memoryJournal.$inferInsert;

/**
 * Subscription - Premium abonelik
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  plan: planEnum("plan").default("free").notNull(),
  status: statusEnum("status").default("active").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  autoRenew: boolean("autoRenew").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Family Sharing - Aile paylaşımı
 */
export const familySharing = pgTable("familySharing", {
  id: serial("id").primaryKey(),
  childId: integer("childId").notNull(),
  ownerUserId: integer("ownerUserId").notNull(),
  sharedWithUserId: integer("sharedWithUserId").notNull(),
  permission: permissionEnum("permission").default("view").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilySharing = typeof familySharing.$inferSelect;
export type InsertFamilySharing = typeof familySharing.$inferInsert;
