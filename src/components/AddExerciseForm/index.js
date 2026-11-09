import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EQUIPMENT_TYPES } from "../../constants/equipment";
import { useAddExercise } from "../../hooks/useAddExercise";
import RadioGroup from "../RadioGroup";
import TagDropdown from "../TagDropdown";

const AddExerciseForm = ({ tags, onAdded }) => {
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState(EQUIPMENT_TYPES[0].value);
  const [tag, setTag] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const { addExercise, saving, error } = useAddExercise();

  const handleAdd = async () => {
    if (!name.trim()) {
      setValidationError("Exercise name is required");
      return;
    }

    setValidationError(null);

    const added = await addExercise({ name, equipment, tag });

    if (!added) return;

    setName("");
    setEquipment(EQUIPMENT_TYPES[0].value);
    setTag(null);
    onAdded();
  };

  const displayError = validationError ?? error;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <Text style={styles.label}>Exercise name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Bench press"
        placeholderTextColor="#888"
        autoCorrect={false}
      />

      <Text style={styles.label}>Equipment</Text>
      <RadioGroup
        options={EQUIPMENT_TYPES}
        value={equipment}
        onChange={setEquipment}
      />

      <Text style={styles.label}>Tag</Text>
      <View style={styles.dropdownRow}>
        <TagDropdown tags={tags} value={tag} onChange={setTag} />
      </View>

      {displayError ? <Text style={styles.error}>{displayError}</Text> : null}

      <Pressable
        accessibilityRole="button"
        onPress={handleAdd}
        disabled={saving}
        style={[styles.submit, saving && styles.submitDisabled]}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Add exercise</Text>
        )}
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownRow: {
    alignItems: "flex-start",
  },
  error: {
    marginTop: 16,
    color: "#b00020",
  },
  submit: {
    marginTop: 24,
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddExerciseForm;
