import { useCallback, useEffect, useState } from "react";
import { SET_COUNT } from "../constants/sets";
import { supabase } from "../lib/supabase";

export const useExerciseProgress = (exerciseId) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("exercise_current_progress")
        .select("set_number, reps, weight, weight_unit")
        .eq("exercise_id", exerciseId);

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setProgress([]);
        setLoading(false);
        return;
      }

      const bySetNumber = new Map(
        (data ?? []).map((row) => [row.set_number, row]),
      );

      setProgress(
        Array.from(
          { length: SET_COUNT },
          (_, index) => bySetNumber.get(index + 1) ?? null,
        ),
      );
      setLoading(false);
    };

    fetchProgress();

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const saveProgress = useCallback(async (rows) => {
    if (rows.length === 0) return null;

    const { error: saveError } = await supabase
      .from("set_progress")
      .insert(rows);

    return saveError;
  }, []);

  return { progress, loading, error, saveProgress };
};
