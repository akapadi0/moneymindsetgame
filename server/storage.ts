import { db } from "./db";
import {
  questions,
  submissions,
  type Question,
  type InsertQuestion,
  type Submission,
  type InsertSubmission,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getQuestions(): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
}

export class DatabaseStorage implements IStorage {
  async getQuestions(): Promise<Question[]> {
    return await db.select().from(questions);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await db.insert(submissions).values(submission).returning();
    return newSubmission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return await db.select().from(submissions).orderBy(desc(submissions.createdAt));
  }
}

export const storage = new DatabaseStorage();
