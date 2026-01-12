import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  category: text("category").notNull(), // e.g., 'Saver', 'Spender'
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  results: jsonb("results").notNull(), // Store scores: { Saver: 5, Spender: 2, ... }
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertQuestionSchema = createInsertSchema(questions).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;

// Request Types
export type CreateSubmissionRequest = InsertSubmission;

// Response Types
export type QuestionResponse = Question;
export type SubmissionResponse = Submission;
