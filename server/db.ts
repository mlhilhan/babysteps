import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  InsertUser,
  users,
  childProfiles,
  InsertChildProfile,
  growthMeasurements,
  InsertGrowthMeasurement,
  developmentalMilestones,
  InsertDevelopmentalMilestone,
  vaccinationSchedule,
  InsertVaccinationSchedule,
  nutritionLog,
  InsertNutritionLog,
  sleepLog,
  InsertSleepLog,
  healthNotes,
  InsertHealthNote,
  memoryJournal,
  InsertMemoryJournal,
  subscriptions,
  InsertSubscription,
  familySharing,
  InsertFamilySharing,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Local auth: user with openId = "local:"+email */
export async function getUserByLocalEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return getUserByOpenId(`local:${normalized}`);
}

export async function createUser(data: {
  email: string;
  name: string | null;
  passwordHash: string;
}): Promise<NonNullable<Awaited<ReturnType<typeof getUserByOpenId>>>> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const email = data.email.trim().toLowerCase();
  const openId = `local:${email}`;
  await db.insert(users).values({
    openId,
    email,
    name: data.name ?? null,
    loginMethod: "email",
    passwordHash: data.passwordHash,
  });
  const user = await getUserByOpenId(openId);
  if (!user) throw new Error("Failed to load created user");
  return user;
}

export async function updateUserLastSignedIn(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

// ========== CHILD PROFILES ==========

export async function createChildProfile(data: InsertChildProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(childProfiles).values(data);
  return true;
}

export async function getChildProfile(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(childProfiles).where(eq(childProfiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserChildProfiles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(childProfiles).where(eq(childProfiles.userId, userId));
}

export async function updateChildProfile(id: number, data: Partial<InsertChildProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(childProfiles).set(data).where(eq(childProfiles.id, id));
}

export async function deleteChildProfile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(childProfiles).where(eq(childProfiles.id, id));
}

// ========== GROWTH MEASUREMENTS ==========

export async function createGrowthMeasurement(data: InsertGrowthMeasurement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(growthMeasurements).values(data);
  return true;
}

export async function getChildGrowthMeasurements(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(growthMeasurements).where(eq(growthMeasurements.childId, childId)).orderBy(desc(growthMeasurements.measurementDate));
}

export async function updateGrowthMeasurement(id: number, data: Partial<InsertGrowthMeasurement>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(growthMeasurements).set(data).where(eq(growthMeasurements.id, id));
}

export async function deleteGrowthMeasurement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(growthMeasurements).where(eq(growthMeasurements.id, id));
}

// ========== DEVELOPMENTAL MILESTONES ==========

export async function createDevelopmentalMilestone(data: InsertDevelopmentalMilestone) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(developmentalMilestones).values(data);
  return true;
}

export async function getChildDevelopmentalMilestones(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(developmentalMilestones).where(eq(developmentalMilestones.childId, childId));
}

export async function updateDevelopmentalMilestone(id: number, data: Partial<InsertDevelopmentalMilestone>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(developmentalMilestones).set(data).where(eq(developmentalMilestones.id, id));
}

// ========== VACCINATION SCHEDULE ==========

export async function createVaccinationSchedule(data: InsertVaccinationSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(vaccinationSchedule).values(data);
  return true;
}

export async function getChildVaccinationSchedule(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(vaccinationSchedule).where(eq(vaccinationSchedule.childId, childId)).orderBy(vaccinationSchedule.recommendedAgeMonths);
}

export async function updateVaccinationSchedule(id: number, data: Partial<InsertVaccinationSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(vaccinationSchedule).set(data).where(eq(vaccinationSchedule.id, id));
}

// ========== NUTRITION LOG ==========

export async function createNutritionLog(data: InsertNutritionLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(nutritionLog).values(data);
  return true;
}

export async function getChildNutritionLog(childId: number, logDate?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (logDate) {
    return db.select().from(nutritionLog).where(and(eq(nutritionLog.childId, childId), eq(nutritionLog.logDate, logDate as any))).orderBy(nutritionLog.time);
  }
  
  return db.select().from(nutritionLog).where(eq(nutritionLog.childId, childId)).orderBy(desc(nutritionLog.logDate));
}

export async function deleteNutritionLog(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(nutritionLog).where(eq(nutritionLog.id, id));
}

// ========== SLEEP LOG ==========

export async function createSleepLog(data: InsertSleepLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(sleepLog).values(data);
  return true;
}

export async function getChildSleepLog(childId: number, sleepDate?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (sleepDate) {
    return db.select().from(sleepLog).where(and(eq(sleepLog.childId, childId), eq(sleepLog.sleepDate, sleepDate as any)));
  }
  
  return db.select().from(sleepLog).where(eq(sleepLog.childId, childId)).orderBy(desc(sleepLog.sleepDate));
}

export async function deleteSleepLog(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(sleepLog).where(eq(sleepLog.id, id));
}

// ========== HEALTH NOTES ==========

export async function createHealthNote(data: InsertHealthNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(healthNotes).values(data);
  return true;
}

export async function getChildHealthNotes(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(healthNotes).where(eq(healthNotes.childId, childId)).orderBy(desc(healthNotes.noteDate));
}

export async function updateHealthNote(id: number, data: Partial<InsertHealthNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(healthNotes).set(data).where(eq(healthNotes.id, id));
}

export async function deleteHealthNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(healthNotes).where(eq(healthNotes.id, id));
}

// ========== MEMORY JOURNAL ==========

export async function createMemoryJournal(data: InsertMemoryJournal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(memoryJournal).values(data);
  return true;
}

export async function getChildMemoryJournal(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(memoryJournal).where(eq(memoryJournal.childId, childId)).orderBy(desc(memoryJournal.journalDate));
}

export async function updateMemoryJournal(id: number, data: Partial<InsertMemoryJournal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(memoryJournal).set(data).where(eq(memoryJournal.id, id));
}

export async function deleteMemoryJournal(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(memoryJournal).where(eq(memoryJournal.id, id));
}

// ========== SUBSCRIPTIONS ==========

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(subscriptions).values(data);
  return true;
}

export async function updateSubscription(id: number, data: Partial<InsertSubscription>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

// ========== FAMILY SHARING ==========

export async function getChildFamilySharing(childId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(familySharing).where(eq(familySharing.childId, childId));
}

export async function createFamilySharing(data: InsertFamilySharing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(familySharing).values(data);
  return true;
}

export async function deleteFamilySharing(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(familySharing).where(eq(familySharing.id, id));
}
