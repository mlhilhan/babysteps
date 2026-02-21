import { parse as parseCookie } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import { ForbiddenError } from "../../shared/_core/errors";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";

const JWT_ISSUER = "babysteps";
const JWT_AUDIENCE = "babysteps-app";

function getSecret() {
  const secret = ENV.cookieSecret;
  if (!secret) throw new Error("JWT_SECRET is required for auth");
  return new TextEncoder().encode(secret);
}

export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await import("bcrypt");
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(plain, hash);
}

export async function createToken(userId: number, expiresInMs: number = ONE_YEAR_MS): Promise<string> {
  const exp = Math.floor((Date.now() + expiresInMs) / 1000);
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(exp)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    const userId = payload.userId;
    if (typeof userId !== "number") return null;
    return { userId };
  } catch {
    return null;
  }
}

function getTokenFromRequest(req: Request): string | undefined {
  const authHeader = req.headers.authorization || (req.headers.Authorization as string | undefined);
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }
  const cookies = parseCookie(req.headers.cookie || "");
  return cookies[COOKIE_NAME] || undefined;
}

/**
 * Authenticate request using our JWT (Bearer or cookie).
 * Returns user or throws ForbiddenError.
 */
export async function authenticateRequest(req: Request): Promise<User> {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw ForbiddenError("Missing or invalid token");
  }

  const payload = await verifyToken(token);
  if (!payload) {
    throw ForbiddenError("Invalid or expired token");
  }

  const user = await db.getUserById(payload.userId);
  if (!user) {
    throw ForbiddenError("User not found");
  }

  await db.updateUserLastSignedIn(user.id);
  return user;
}
