import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RepDropdown from "../../components/RepDropdown";
import WeightDropdown from "../../components/WeightDropdown";
import { useExerciseProgress } from "../../hooks/useExerciseProgress";

const ExerciseDetailPage = ({ exercise, onBack }) => {
  const { progress, loading, error, saveProgress } = useExerciseProgress(
    exercise.id,
  );
  console.log(typeof progress);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [selectedReps, setSelectedReps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setSelectedWeights(
      progress.map((set) => (set?.weight != null ? Number(set.weight) : null)),
    );
    setSelectedReps(progress.map((set) => set?.reps ?? null));
  }, [progress]);

  const handleWeightChange = (index, weight) => {
    setSelectedWeights((current) => {
      const next = [...current];
      next[index] = weight;
      return next;
    });
  };

  const handleRepChange = (index, reps) => {
    setSelectedReps((current) => {
      const next = [...current];
      next[index] = reps;
      return next;
    });
  };

  const handleBack = useCallback(async () => {
    if (saving) return;

    const changedSets = progress
      .map((set, index) => {
        const reps = selectedReps[index] ?? null;
        const weight = selectedWeights[index] ?? null;
        const storedReps = set?.reps ?? null;
        const storedWeight = set?.weight != null ? Number(set.weight) : null;

        if (reps === storedReps && weight === storedWeight) return null;

        return {
          exercise_id: exercise.id,
          set_number: index + 1,
          reps: reps ?? storedReps ?? 0,
          weight: weight ?? storedWeight ?? null,
          weight_unit: set?.weight_unit ?? "kg",
        };
      })
      .filter(Boolean);

    if (changedSets.length === 0) {
      onBack();
      return;
    }

    setSaving(true);
    setSaveError(null);

    const insertError = await saveProgress(changedSets);

    setSaving(false);

    if (insertError) {
      setSaveError(insertError.message);
      return;
    }

    onBack();
  }, [
    exercise.id,
    onBack,
    progress,
    saveProgress,
    saving,
    selectedReps,
    selectedWeights,
  ]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      },
    );

    return () => subscription.remove();
  }, [handleBack]);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={handleBack}
        disabled={saving}
        style={styles.backButton}
      >
        <Text style={styles.backText}>{saving ? "Saving..." : "‹ Back"}</Text>
      </Pressable>

      {saveError ? <Text style={styles.error}>{saveError}</Text> : null}

      <Text style={styles.title}>{exercise.name}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.equipment}>{exercise.equipment}</Text>
        {(exercise.tags ?? []).map((tag) => (
          <View key={tag.id} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{tag.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Progress</Text>

        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.setList}>
            {progress.map((set, index) => (
              <View
                key={index}
                style={[
                  styles.setRow,
                  index === progress.length - 1 && styles.setRowLast,
                ]}
              >
                <Text style={styles.setLabel}>Set {index + 1}</Text>

                <View style={styles.setRight}>
                  <RepDropdown
                    value={selectedReps[index] ?? null}
                    onChange={(reps) => handleRepChange(index, reps)}
                  />
                  <WeightDropdown
                    value={selectedWeights[index] ?? null}
                    unit={set?.weight_unit ?? "kg"}
                    onChange={(weight) => handleWeightChange(index, weight)}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: "#0a7ea4",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  equipment: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  tagChip: {
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipText: {
    fontSize: 12,
    color: "#333",
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  error: {
    color: "#b00020",
  },
  setList: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  setRowLast: {
    borderBottomWidth: 0,
  },
  setLabel: {
    color: "#666",
  },
  setRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default ExerciseDetailPage;
