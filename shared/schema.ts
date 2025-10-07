import { sql } from "drizzle-orm";
import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create admin_panel schema
export const adminPanelSchema = pgSchema("admin_panel");

// auth_users table in admin_panel schema
export const authUsers = adminPanelSchema.table("auth_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for registration
export const insertAuthUserSchema = createInsertSchema(authUsers).omit({
  id: true,
  createdAt: true,
});

// Schema for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type InsertAuthUser = z.infer<typeof insertAuthUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type AuthUser = typeof authUsers.$inferSelect;
