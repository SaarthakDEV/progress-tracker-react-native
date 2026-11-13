import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { useExerciseStore } from "../store/store";

export const useAddExercise = () => {
  const addExercises = useExerciseStore((s) => s.addExercises);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const addExercise = useCallback(
    async ({ name, equipment, tag }) => {
      setSaving(true);
      setError(null);

      const { data: exercise, error: insertError } = await supabase
        .from("exercises")
        .insert({ name: name.trim(), equipment, is_custom: true })
        .select("id, name, equipment, is_custom, is_archived")
        .single();

      if (insertError) {
        setSaving(false);
        setError(insertError.message);
        return null;
      }

      if (tag) {
        const { error: tagError } = await supabase
          .from("exercise_tags")
          .insert({ exercise_id: exercise.id, tag_id: tag.id });

        if (tagError) {
          await supabase.from("exercises").delete().eq("id", exercise.id);
          setSaving(false);
          setError(tagError.message);
          return null;
        }
      }

      const newExercise = {
        ...exercise,
        tags: tag ? [tag] : [],
      };

      addExercises([newExercise]);
      setSaving(false);
      return newExercise;
    },
    [addExercises],
  );

  return { addExercise, saving, error };
};
