-- Add passwordHash for email/password (local) auth; null for OAuth users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordHash" text;
