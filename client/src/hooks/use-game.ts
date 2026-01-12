import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SubmissionInput, type SubmissionResponse } from "@shared/routes";

// GET /api/questions
export function useQuestions() {
  return useQuery({
    queryKey: [api.questions.list.path],
    queryFn: async () => {
      const res = await fetch(api.questions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch questions");
      return api.questions.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/submissions
export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmissionInput) => {
      const res = await fetch(api.submissions.create.path, {
        method: api.submissions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.submissions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to submit results");
      }
      
      return api.submissions.create.responses[201].parse(await res.json());
    },
    // Invalidate list so admin sees new submission immediately
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.submissions.list.path] }),
  });
}

// GET /api/submissions (Admin only)
export function useSubmissions() {
  return useQuery({
    queryKey: [api.submissions.list.path],
    queryFn: async () => {
      const res = await fetch(api.submissions.list.path, { credentials: "include" });
      
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return api.submissions.list.responses[200].parse(await res.json());
    },
  });
}
