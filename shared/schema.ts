import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Certificate Schema
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateNumber: text("certificate_number").notNull().unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  aadharNumber: text("aadhar_number").notNull(),
  certificateName: text("certificate_name").notNull(),
  issueDate: date("issue_date").notNull(),
  percentageScore: integer("percentage_score").notNull(),
});

export const certificatesInsertSchema = createInsertSchema(certificates);
export const certificatesSelectSchema = createSelectSchema(certificates);
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof certificatesInsertSchema>;

// Contact Messages Schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  course: text("course").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open").notNull(), // 'open' or 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessagesInsertSchema = createInsertSchema(contactMessages);
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof contactMessagesInsertSchema>;
