import { sql } from "drizzle-orm";
import { pgSchema, pgTable, serial, text, timestamp, numeric } from "drizzle-orm/pg-core";
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

// admin_trade_signals table in public schema
export const adminTradeSignals = pgTable("admin_trade_signals", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  ep: numeric("ep", { precision: 20, scale: 8 }).notNull(),
  qty: numeric("qty", { precision: 20, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradeSignalSchema = createInsertSchema(adminTradeSignals).omit({
  id: true,
  createdAt: true,
});

export type InsertTradeSignal = z.infer<typeof insertTradeSignalSchema>;
export type TradeSignal = typeof adminTradeSignals.$inferSelect;
