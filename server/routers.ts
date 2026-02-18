import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== CHILD PROFILES ==========
  children: router({
    list: protectedProcedure.query(({ ctx }) => {
      return db.getUserChildProfiles(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Ad gerekli").max(255),
          dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
          gender: z.enum(["male", "female", "other"]),
          photoUrl: z.string().optional(),
          bloodType: z.string().max(10).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createChildProfile({
          userId: ctx.user.id,
          name: input.name,
          dateOfBirth: new Date(input.dateOfBirth),
          gender: input.gender,
          photoUrl: input.photoUrl,
          bloodType: input.bloodType,
          notes: input.notes,
        });
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return db.getChildProfile(input.id);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().max(255).optional(),
          photoUrl: z.string().optional(),
          bloodType: z.string().max(10).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateChildProfile(input.id, {
          name: input.name,
          photoUrl: input.photoUrl,
          bloodType: input.bloodType,
          notes: input.notes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteChildProfile(input.id);
      }),
  }),

  // ========== GROWTH MEASUREMENTS ==========
  growth: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(({ input }) => {
        return db.getChildGrowthMeasurements(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          height: z.number().positive("Boy pozitif olmalı"),
          weight: z.number().positive("Kilo pozitif olmalı"),
          headCircumference: z.number().positive().optional(),
          measurementDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.createGrowthMeasurement({
          childId: input.childId,
          height: input.height.toString() as any,
          weight: input.weight.toString() as any,
          headCircumference: input.headCircumference?.toString() as any,
          measurementDate: new Date(input.measurementDate),
          notes: input.notes,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          height: z.number().positive().optional(),
          weight: z.number().positive().optional(),
          headCircumference: z.number().positive().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateGrowthMeasurement(input.id, {
          height: input.height?.toString() as any,
          weight: input.weight?.toString() as any,
          headCircumference: input.headCircumference?.toString() as any,
          notes: input.notes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteGrowthMeasurement(input.id);
      }),
  }),

  // ========== DEVELOPMENTAL MILESTONES ==========
  milestones: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(({ input }) => {
        return db.getChildDevelopmentalMilestones(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          category: z.enum(["motor", "language", "social", "cognitive"]),
          milestone: z.string().min(1).max(255),
          expectedAgeMonths: z.number().int().positive(),
          achieved: z.boolean().default(false),
          achievedDate: z.string().optional(),
          photoUrl: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.createDevelopmentalMilestone({
          childId: input.childId,
          category: input.category,
          milestone: input.milestone,
          expectedAgeMonths: input.expectedAgeMonths,
          achieved: input.achieved,
          achievedDate: input.achievedDate ? new Date(input.achievedDate) : null,
          photoUrl: input.photoUrl,
          notes: input.notes,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          achieved: z.boolean().optional(),
          achievedDate: z.string().optional(),
          photoUrl: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateDevelopmentalMilestone(input.id, {
          achieved: input.achieved,
          achievedDate: input.achievedDate ? new Date(input.achievedDate) : null,
          photoUrl: input.photoUrl,
          notes: input.notes,
        });
      }),
  }),

  // ========== VACCINATION SCHEDULE ==========
  vaccinations: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(({ input }) => {
        return db.getChildVaccinationSchedule(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          vaccineName: z.string().min(1).max(255),
          recommendedAgeMonths: z.number().int().nonnegative(),
          scheduledDate: z.string().optional(),
          administeredDate: z.string().optional(),
          administered: z.boolean().default(false),
          doctorName: z.string().max(255).optional(),
          clinic: z.string().max(255).optional(),
          batchNumber: z.string().max(255).optional(),
          sideEffects: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.createVaccinationSchedule({
          childId: input.childId,
          vaccineName: input.vaccineName,
          recommendedAgeMonths: input.recommendedAgeMonths,
          scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : null,
          administeredDate: input.administeredDate ? new Date(input.administeredDate) : null,
          administered: input.administered,
          doctorName: input.doctorName,
          clinic: input.clinic,
          batchNumber: input.batchNumber,
          sideEffects: input.sideEffects,
          notes: input.notes,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          administered: z.boolean().optional(),
          administeredDate: z.string().optional(),
          doctorName: z.string().optional(),
          clinic: z.string().optional(),
          batchNumber: z.string().optional(),
          sideEffects: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateVaccinationSchedule(input.id, {
          administered: input.administered,
          administeredDate: input.administeredDate ? new Date(input.administeredDate) : null,
          doctorName: input.doctorName,
          clinic: input.clinic,
          batchNumber: input.batchNumber,
          sideEffects: input.sideEffects,
          notes: input.notes,
        });
      }),
  }),

  // ========== NUTRITION LOG ==========
  nutrition: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number(), logDate: z.string().optional() }))
      .query(({ input }) => {
        return db.getChildNutritionLog(input.childId, input.logDate);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          logDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
          type: z.enum(["breastfeeding", "formula", "solid_food", "snack", "water"]),
          description: z.string().min(1).max(255),
          duration: z.number().int().nonnegative().optional(),
          quantity: z.string().max(100).optional(),
          time: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM formatında girin").optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.createNutritionLog({
          childId: input.childId,
          logDate: new Date(input.logDate),
          type: input.type,
          description: input.description,
          duration: input.duration,
          quantity: input.quantity,
          time: input.time,
          notes: input.notes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteNutritionLog(input.id);
      }),
  }),

  // ========== SLEEP LOG ==========
  sleep: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number(), sleepDate: z.string().optional() }))
      .query(({ input }) => {
        return db.getChildSleepLog(input.childId, input.sleepDate);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          sleepDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
          startTime: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM formatında girin"),
          endTime: z.string().regex(/^\d{2}:\d{2}$/, "HH:MM formatında girin"),
          duration: z.number().int().positive(),
          quality: z.enum(["poor", "fair", "good", "excellent"]).default("good"),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.createSleepLog({
          childId: input.childId,
          sleepDate: new Date(input.sleepDate),
          startTime: input.startTime,
          endTime: input.endTime,
          duration: input.duration,
          quality: input.quality,
          notes: input.notes,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteSleepLog(input.id);
      }),
  }),

  // ========== HEALTH NOTES ==========
  health: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(({ input }) => {
        return db.getChildHealthNotes(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          type: z.enum(["medication", "doctor_visit", "allergy", "illness", "general"]),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          medicationName: z.string().max(255).optional(),
          dosage: z.string().max(100).optional(),
          frequency: z.string().max(100).optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          doctorName: z.string().max(255).optional(),
          clinic: z.string().max(255).optional(),
          noteDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
        })
      )
      .mutation(({ input }) => {
        return db.createHealthNote({
          childId: input.childId,
          type: input.type,
          title: input.title,
          description: input.description,
          medicationName: input.medicationName,
          dosage: input.dosage,
          frequency: input.frequency,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          doctorName: input.doctorName,
          clinic: input.clinic,
          noteDate: new Date(input.noteDate),
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().max(255).optional(),
          description: z.string().optional(),
          medicationName: z.string().max(255).optional(),
          dosage: z.string().max(100).optional(),
          frequency: z.string().max(100).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateHealthNote(input.id, {
          title: input.title,
          description: input.description,
          medicationName: input.medicationName,
          dosage: input.dosage,
          frequency: input.frequency,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteHealthNote(input.id);
      }),
  }),

  // ========== MEMORY JOURNAL ==========
  journal: router({
    list: protectedProcedure
      .input(z.object({ childId: z.number() }))
      .query(({ input }) => {
        return db.getChildMemoryJournal(input.childId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          mediaUrl: z.string().optional(),
          mediaType: z.enum(["photo", "video", "text"]),
          tags: z.string().optional(),
          journalDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
        })
      )
      .mutation(({ input }) => {
        return db.createMemoryJournal({
          childId: input.childId,
          title: input.title,
          description: input.description,
          mediaUrl: input.mediaUrl,
          mediaType: input.mediaType,
          tags: input.tags,
          journalDate: new Date(input.journalDate),
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().max(255).optional(),
          description: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        return db.updateMemoryJournal(input.id, {
          title: input.title,
          description: input.description,
          tags: input.tags,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        return db.deleteMemoryJournal(input.id);
      }),
  }),

  // ========== SUBSCRIPTIONS ==========
  subscription: router({
    get: protectedProcedure.query(({ ctx }) => {
      return db.getUserSubscription(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          plan: z.enum(["free", "premium", "premium_plus"]).default("free"),
          startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir tarih girin"),
          endDate: z.string().optional(),
          autoRenew: z.boolean().default(true),
        })
      )
      .mutation(({ ctx, input }) => {
        return db.createSubscription({
          userId: ctx.user.id,
          plan: input.plan,
          status: "active",
          startDate: new Date(input.startDate),
          endDate: input.endDate ? new Date(input.endDate) : null,
          autoRenew: input.autoRenew,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
