import { create } from "zustand";
import { supabase } from "../lib/supabase";

export const useExerciseStore = create((set, get) => ({
  exercises: [],
  tags: [],
  loading: false,
  error: null,

  fetchInitialData: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const [exercisesRes, tagsRes] = await Promise.all([
        supabase
          .from("exercises")
          .select("id, name, equipment, is_custom, is_archived, tags(id, name)")
          .order("name", { ascending: true }),
        supabase
          .from("tags")
          .select("id, name")
          .order("name", { ascending: true }),
      ]);

      const error = exercisesRes.error || tagsRes.error;

      if (error) {
        set({ error: error.message, loading: false });
        return;
      }

      set({
        exercises: exercisesRes.data ?? [],
        tags: tagsRes.data ?? [],
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // still under review not sure what is it about
  addExercises: (incoming) =>
    set((state) => {
      const byId = new Map(
        state.exercises.map((exercise) => [exercise.id, exercise]),
      );

      for (const exercise of incoming) {
        byId.set(exercise.id, exercise);
      }

      return {
        exercises: [...byId.values()].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      };
    }),
}));
