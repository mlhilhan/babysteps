import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Child Profiles - Her çocuğun temel bilgileri
 */
export const childProfiles = mysqlTable("childProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateOfBirth: date("dateOfBirth").notNull(),
  gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
  photoUrl: text("photoUrl"),
  bloodType: varchar("bloodType", { length: 10 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChildProfile = typeof childProfiles.$inferSelect;
export type InsertChildProfile = typeof childProfiles.$inferInsert;

/**
 * Growth Measurements - Boy ve kilo takibi
 */
export const growthMeasurements = mysqlTable("growthMeasurements", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  height: decimal("height", { precision: 5, scale: 2 }).notNull(), // cm cinsinden
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // kg cinsinden
  headCircumference: decimal("headCircumference", { precision: 5, scale: 2 }), // cm cinsinden
  measurementDate: date("measurementDate").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GrowthMeasurement = typeof growthMeasurements.$inferSelect;
export type InsertGrowthMeasurement = typeof growthMeasurements.$inferInsert;

/**
 * Developmental Milestones - Gelişim kilometre taşları
 */
export const developmentalMilestones = mysqlTable("developmentalMilestones", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  category: mysqlEnum("category", ["motor", "language", "social", "cognitive"]).notNull(),
  milestone: varchar("milestone", { length: 255 }).notNull(),
  expectedAgeMonths: int("expectedAgeMonths").notNull(),
  achieved: boolean("achieved").default(false).notNull(),
  achievedDate: date("achievedDate"),
  photoUrl: text("photoUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DevelopmentalMilestone = typeof developmentalMilestones.$inferSelect;
export type InsertDevelopmentalMilestone = typeof developmentalMilestones.$inferInsert;

/**
 * Vaccination Schedule - Aşı takvimi
 */
export const vaccinationSchedule = mysqlTable("vaccinationSchedule", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  vaccineName: varchar("vaccineName", { length: 255 }).notNull(),
  recommendedAgeMonths: int("recommendedAgeMonths").notNull(),
  scheduledDate: date("scheduledDate"),
  administeredDate: date("administeredDate"),
  administered: boolean("administered").default(false).notNull(),
  doctorName: varchar("doctorName", { length: 255 }),
  clinic: varchar("clinic", { length: 255 }),
  batchNumber: varchar("batchNumber", { length: 255 }),
  sideEffects: text("sideEffects"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VaccinationSchedule = typeof vaccinationSchedule.$inferSelect;
export type InsertVaccinationSchedule = typeof vaccinationSchedule.$inferInsert;

/**
 * Nutrition Log - Beslenme günlüğü
 */
export const nutritionLog = mysqlTable("nutritionLog", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  logDate: date("logDate").notNull(),
  type: mysqlEnum("type", ["breastfeeding", "formula", "solid_food", "snack", "water"]).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  duration: int("duration"), // dakika cinsinden (emzirme için)
  quantity: varchar("quantity", { length: 100 }), // ml, gram, vb.
  time: varchar("time", { length: 10 }), // HH:MM formatında
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NutritionLog = typeof nutritionLog.$inferSelect;
export type InsertNutritionLog = typeof nutritionLog.$inferInsert;

/**
 * Sleep Log - Uyku takibi
 */
export const sleepLog = mysqlTable("sleepLog", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  sleepDate: date("sleepDate").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(), // HH:MM
  endTime: varchar("endTime", { length: 10 }).notNull(), // HH:MM
  duration: int("duration").notNull(), // dakika cinsinden
  quality: mysqlEnum("quality", ["poor", "fair", "good", "excellent"]).default("good").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SleepLog = typeof sleepLog.$inferSelect;
export type InsertSleepLog = typeof sleepLog.$inferInsert;

/**
 * Health Notes - Sağlık notları ve ilaç hatırlatıcıları
 */
export const healthNotes = mysqlTable("healthNotes", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  type: mysqlEnum("type", ["medication", "doctor_visit", "allergy", "illness", "general"]).notNull(),
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthNote = typeof healthNotes.$inferSelect;
export type InsertHealthNote = typeof healthNotes.$inferInsert;

/**
 * Memory Journal - Anı defteri (fotoğraf ve yazılar)
 */
export const memoryJournal = mysqlTable("memoryJournal", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mediaUrl: text("mediaUrl"), // S3 URL
  mediaType: mysqlEnum("mediaType", ["photo", "video", "text"]).notNull(),
  tags: varchar("tags", { length: 500 }), // virgülle ayrılmış etiketler
  journalDate: date("journalDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MemoryJournal = typeof memoryJournal.$inferSelect;
export type InsertMemoryJournal = typeof memoryJournal.$inferInsert;

/**
 * Subscription - Premium abonelik
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", ["free", "premium", "premium_plus"]).default("free").notNull(),
  status: mysqlEnum("status", ["active", "cancelled", "expired"]).default("active").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate"),
  autoRenew: boolean("autoRenew").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Family Sharing - Aile paylaşımı
 */
export const familySharing = mysqlTable("familySharing", {
  id: int("id").autoincrement().primaryKey(),
  childId: int("childId").notNull(),
  ownerUserId: int("ownerUserId").notNull(),
  sharedWithUserId: int("sharedWithUserId").notNull(),
  permission: mysqlEnum("permission", ["view", "edit", "admin"]).default("view").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilySharing = typeof familySharing.$inferSelect;
export type InsertFamilySharing = typeof familySharing.$inferInsert;
