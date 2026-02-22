import type { Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";
import * as db from "../db";
import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
  authenticateRequest,
} from "./localAuth";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";

function buildUserResponse(user: Awaited<ReturnType<typeof db.getUserById>>) {
  if (!user) return null;
  return {
    id: user.id,
    openId: user.openId,
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: (user.lastSignedIn ?? new Date()).toISOString(),
  };
}

export function registerLocalAuthRoutes(app: import("express").Express) {
  // POST /api/auth/register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body as {
        email?: string;
        password?: string;
        name?: string;
      };
      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
        res.status(400).json({ error: "Email is required" });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters" });
        return;
      }

      const existing = await db.getUserByLocalEmail(trimmedEmail);
      if (existing) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }

      const passwordHash = await hashPassword(password);
      const user = await db.createUser({
        email: trimmedEmail,
        name: typeof name === "string" ? name.trim() || null : null,
        passwordHash,
      });

      const token = await createToken(user.id);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.status(201).json({
        token,
        user: buildUserResponse(user),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      console.error("[Auth] Register failed:", message, stack ?? "");
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // POST /api/auth/login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || typeof email !== "string" || !password || typeof password !== "string") {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await db.getUserByLocalEmail(email.trim());
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = await createToken(user.id);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        token,
        user: buildUserResponse(user),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;
      console.error("[Auth] Login failed:", message, stack ?? "");
      res.status(500).json({ error: "Login failed" });
    }
  });

  // POST /api/auth/refresh
  app.post("/api/auth/refresh", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      const token =
        typeof authHeader === "string" && authHeader.startsWith("Bearer ")
          ? authHeader.slice("Bearer ".length).trim()
          : undefined;
      if (!token) {
        res.status(401).json({ error: "Token required" });
        return;
      }

      const payload = await verifyToken(token);
      if (!payload) {
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }

      const user = await db.getUserById(payload.userId);
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      const newToken = await createToken(user.id);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, newToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        token: newToken,
        user: buildUserResponse(user),
      });
    } catch (err) {
      console.error("[Auth] Refresh failed:", err);
      res.status(500).json({ error: "Refresh failed" });
    }
  });

  // GET /api/auth/me - use local JWT auth
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const user = await authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (err) {
      console.error("[Auth] /api/auth/me failed:", err);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // POST /api/auth/session - set cookie from Bearer (e.g. for web after login)
  app.post("/api/auth/session", async (req: Request, res: Response) => {
    try {
      const user = await authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (err) {
      console.error("[Auth] /api/auth/session failed:", err);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}
