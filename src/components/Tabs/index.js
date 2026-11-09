import { Pressable, StyleSheet, Text, View } from "react-native";

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = tab.value === activeTab;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.value)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  activeLabel: {
    fontWeight: "600",
    color: "#111",
  },
});

export default Tabs;
