import { z } from 'zod';
import { insertQuestionSchema, insertSubmissionSchema, questions, submissions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  questions: {
    list: {
      method: 'GET' as const,
      path: '/api/questions',
      responses: {
        200: z.array(z.custom<typeof questions.$inferSelect>()),
      },
    },
  },
  submissions: {
    create: {
      method: 'POST' as const,
      path: '/api/submissions',
      input: insertSubmissionSchema,
      responses: {
        201: z.custom<typeof submissions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/submissions',
      responses: {
        200: z.array(z.custom<typeof submissions.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type QuestionResponse = z.infer<typeof api.questions.list.responses[200]>[number];
export type SubmissionInput = z.infer<typeof api.submissions.create.input>;
export type SubmissionResponse = z.infer<typeof api.submissions.create.responses[201]>;
