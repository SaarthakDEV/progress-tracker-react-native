import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Dropdown = ({
  value,
  options,
  onChange,
  title,
  formatOption = String,
  getKey = (item) => String(item),
  placeholder = "--",
}) => {
  const [open, setOpen] = useState(false);
  const selectedKey = value != null ? getKey(value) : null;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={styles.trigger}
      >
        <Text style={styles.triggerText}>
          {value != null ? formatOption(value) : placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.backdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />

          <View style={styles.menu}>
            <Text style={styles.menuTitle}>{title}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => getKey(item)}
              ListEmptyComponent={
                <Text style={styles.empty}>No options available</Text>
              }
              renderItem={({ item }) => {
                const selected =
                  selectedKey != null && getKey(item) === selectedKey;

                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    style={[styles.option, selected && styles.optionSelected]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {formatOption(item)}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 88,
    alignItems: "center",
  },
  triggerText: {
    fontSize: 14,
    color: "#333",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: "70%",
    maxHeight: "60%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  empty: {
    paddingVertical: 16,
    textAlign: "center",
    color: "#666",
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#e8f1f5",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  optionTextSelected: {
    fontWeight: "600",
    color: "#0a7ea4",
  },
});

export default Dropdown;
