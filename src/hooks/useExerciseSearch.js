import { useMemo, useState } from "react";
import { useExerciseStore } from "../store/store";

export const useExerciseSearch = () => {
  const [search, setSearch] = useState("");
  const exercises = useExerciseStore((s) => s.exercises);
  const loading = useExerciseStore((s) => s.loading);
  const error = useExerciseStore((s) => s.error);

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return exercises;

    return exercises.filter((exercise) => {
      const matchesName = exercise.name.toLowerCase().includes(query);
      const matchesTag = (exercise.tags ?? []).some((tag) =>
        tag.name.toLowerCase().includes(query),
      );

      return matchesName || matchesTag;
    });
  }, [exercises, search]);

  return {
    search,
    setSearch,
    exercises: filteredExercises,
    loading,
    error,
  };
};
