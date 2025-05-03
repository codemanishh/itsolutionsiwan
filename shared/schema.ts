import { pgTable, text, serial, integer, boolean, date, timestamp, varchar } from "drizzle-orm/pg-core";
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

// Computer Courses Schema
export const computerCourses = pgTable("computer_courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Computer Course Learning Points
export const computerLearningPoints = pgTable("computer_learning_points", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => computerCourses.id, { onDelete: 'cascade' }).notNull(),
  point: text("point").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// Relations for computer courses
export const computerCoursesRelations = relations(computerCourses, ({ many }) => ({
  learningPoints: many(computerLearningPoints),
}));

export const computerLearningPointsRelations = relations(computerLearningPoints, ({ one }) => ({
  course: one(computerCourses, {
    fields: [computerLearningPoints.courseId],
    references: [computerCourses.id]
  }),
}));

// Typing Courses Schema
export const typingCourses = pgTable("typing_courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  duration: varchar("duration", { length: 100 }).notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Typing Course Learning Points
export const typingLearningPoints = pgTable("typing_learning_points", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => typingCourses.id, { onDelete: 'cascade' }).notNull(),
  point: text("point").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// Relations for typing courses
export const typingCoursesRelations = relations(typingCourses, ({ many }) => ({
  learningPoints: many(typingLearningPoints),
}));

export const typingLearningPointsRelations = relations(typingLearningPoints, ({ one }) => ({
  course: one(typingCourses, {
    fields: [typingLearningPoints.courseId],
    references: [typingCourses.id]
  }),
}));

// Schemas for Computer Courses
export const computerCoursesInsertSchema = createInsertSchema(computerCourses, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  fullName: (schema) => schema.min(2, "Full name must be at least 2 characters"),
  duration: (schema) => schema.min(2, "Duration must be specified"),
  price: (schema) => schema.min(1, "Price must be specified"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const computerLearningPointsInsertSchema = createInsertSchema(computerLearningPoints, {
  point: (schema) => schema.min(3, "Learning point must be at least 3 characters"),
});

// Schemas for Typing Courses
export const typingCoursesInsertSchema = createInsertSchema(typingCourses, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  duration: (schema) => schema.min(2, "Duration must be specified"),
  price: (schema) => schema.min(1, "Price must be specified"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
});

export const typingLearningPointsInsertSchema = createInsertSchema(typingLearningPoints, {
  point: (schema) => schema.min(3, "Learning point must be at least 3 characters"),
});

// Export types
export type ComputerCourse = typeof computerCourses.$inferSelect;
export type InsertComputerCourse = z.infer<typeof computerCoursesInsertSchema>;
export type ComputerLearningPoint = typeof computerLearningPoints.$inferSelect;
export type InsertComputerLearningPoint = z.infer<typeof computerLearningPointsInsertSchema>;

export type TypingCourse = typeof typingCourses.$inferSelect;
export type InsertTypingCourse = z.infer<typeof typingCoursesInsertSchema>;
export type TypingLearningPoint = typeof typingLearningPoints.$inferSelect;
export type InsertTypingLearningPoint = z.infer<typeof typingLearningPointsInsertSchema>;

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
