import { Pressable, StyleSheet, Text } from "react-native";

const ExerciseCard = ({ exercise, onPress }) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.name}>{exercise.name}</Text>
      <Text style={styles.meta}>
        <Text style={styles.equipment}>{exercise.equipment}</Text>
        {(exercise.tags ?? []).length > 0 && (
          <Text style={styles.tags}>
            {" · "}
            {exercise.tags.map((tag) => tag.name).join(" · ")}
          </Text>
        )}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.6,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    marginTop: 4,
  },
  equipment: {
    color: "#666",
    textTransform: "capitalize",
  },
  tags: {
    color: "#444",
    fontSize: 12,
  },
});

export default ExerciseCard;
