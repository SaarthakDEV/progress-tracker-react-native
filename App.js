import { useEffect, useState } from "react";
import ExerciseDetailPage from "./src/pages/ExerciseDetailPage";
import ExercisesPage from "./src/pages/ExercisesPage";
import { useExerciseStore } from "./src/store/store";

const App = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const fetchInitialData = useExerciseStore((s) => s.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (selectedExercise) {
    return (
      <ExerciseDetailPage
        exercise={selectedExercise}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return <ExercisesPage onSelectExercise={setSelectedExercise} />;
};

export default App;
