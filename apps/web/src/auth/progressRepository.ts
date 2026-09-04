import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressRepository } from "./types";

export function createProgressRepository(client: SupabaseClient): ProgressRepository {
  return {
    async load(userId) {
      const { data, error } = await client
        .from("problem_progress")
        .select("problem_id")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      return new Set(data.map((row) => Number(row.problem_id)));
    },

    async mark(userId, problemId) {
      const { error } = await client
        .from("problem_progress")
        .upsert({ user_id: userId, problem_id: problemId }, { onConflict: "user_id,problem_id" });

      if (error) {
        throw error;
      }
    },

    async unmark(userId, problemId) {
      const { error } = await client
        .from("problem_progress")
        .delete()
        .eq("user_id", userId)
        .eq("problem_id", problemId);

      if (error) {
        throw error;
      }
    },
  };
}

export const unavailableProgressRepository: ProgressRepository = {
  async load() {
    throw new Error("Problem progress sync is not configured.");
  },
  async mark() {
    throw new Error("Problem progress sync is not configured.");
  },
  async unmark() {
    throw new Error("Problem progress sync is not configured.");
  },
};
