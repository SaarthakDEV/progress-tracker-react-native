import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddExerciseForm from "../../components/AddExerciseForm";
import ExerciseCard from "../../components/ExerciseCard";
import SearchBar from "../../components/SearchBar";
import Tabs from "../../components/Tabs";
import { useExerciseSearch } from "../../hooks/useExerciseSearch";
import { useExerciseStore } from "../../store/store";

const TABS = [
  { label: "Search", value: "search" },
  { label: "Add", value: "add" },
];

const ExercisesPage = ({ onSelectExercise }) => {
  const [activeTab, setActiveTab] = useState("search");
  const { search, setSearch, exercises, loading, error } = useExerciseSearch();
  const tags = useExerciseStore((s) => s.tags);

  const handleAdded = () => {
    setSearch("");
    setActiveTab("search");
  };

  return (
    <View style={styles.container}>
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "search" ? (
        <>
          <SearchBar value={search} onChangeText={setSearch} />

          {loading ? (
            <ActivityIndicator style={styles.status} />
          ) : error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>No exercises found</Text>
              }
              renderItem={({ item }) => (
                <ExerciseCard
                  exercise={item}
                  onPress={() => onSelectExercise(item)}
                />
              )}
            />
          )}
        </>
      ) : (
        <AddExerciseForm tags={tags} onAdded={handleAdded} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 64,
  },
  status: {
    marginTop: 24,
  },
  error: {
    marginTop: 24,
    color: "#b00020",
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    marginTop: 24,
    color: "#666",
    textAlign: "center",
  },
});

export default ExercisesPage;
