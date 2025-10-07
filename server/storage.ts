import { type AuthUser, type InsertAuthUser, type TradeSignal, authUsers, adminTradeSignals } from "@shared/schema";
import { db } from "./db";
import { externalDb } from "./external-db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: number): Promise<AuthUser | undefined>;
  getUserByEmail(email: string): Promise<AuthUser | undefined>;
  getUserByUsername(username: string): Promise<AuthUser | undefined>;
  createUser(user: InsertAuthUser): Promise<AuthUser>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  getTradeSignals(): Promise<TradeSignal[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.email, email));
    return user;
  }

  async getUserByUsername(username: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.username, username));
    return user;
  }

  async createUser(insertUser: InsertAuthUser): Promise<AuthUser> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const [user] = await db
      .insert(authUsers)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async getTradeSignals(): Promise<TradeSignal[]> {
    const signals = await externalDb.select().from(adminTradeSignals);
    return signals;
  }
}

export const storage = new DatabaseStorage();
