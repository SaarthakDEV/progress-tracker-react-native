import { StyleSheet, Text, View } from "react-native";

const OfflineBanner = () => {
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <Text style={styles.text}>No internet connection detected</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#b00020",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default OfflineBanner;
