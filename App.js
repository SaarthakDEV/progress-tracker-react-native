import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import OfflineBanner from "./src/components/OfflineBanner";
import { useNetworkStatus } from "./src/hooks/useNetworkStatus";
import ExerciseDetailPage from "./src/pages/ExerciseDetailPage";
import ExercisesPage from "./src/pages/ExercisesPage";
import { useExerciseStore } from "./src/store/store";

const App = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const fetchInitialData = useExerciseStore((s) => s.fetchInitialData);
  const { isOffline } = useNetworkStatus();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        {isOffline ? (
          <SafeAreaView edges={["top"]} style={styles.offlineSafeArea}>
            <OfflineBanner />
          </SafeAreaView>
        ) : null}

        <View style={styles.content}>
          {selectedExercise ? (
            <ExerciseDetailPage
              exercise={selectedExercise}
              onBack={() => setSelectedExercise(null)}
            />
          ) : (
            <ExercisesPage onSelectExercise={setSelectedExercise} />
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  offlineSafeArea: {
    backgroundColor: "#b00020",
  },
});

export default App;
