import { Pressable, StyleSheet, Text, View } from "react-native";

const RadioGroup = ({ options, value, onChange }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={styles.option}
          >
            <View style={[styles.outer, selected && styles.outerSelected]}>
              {selected ? <View style={styles.inner} /> : null}
            </View>
            <Text style={styles.label}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
    justifyContent: "center",
  },
  outerSelected: {
    borderColor: "#0a7ea4",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0a7ea4",
  },
  label: {
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
});

export default RadioGroup;
