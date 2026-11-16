import { useEffect, useState } from "react";
import { HISTORY_LIMIT } from "../constants/chart";
import { SET_COUNT } from "../constants/sets";
import { supabase } from "../lib/supabase";

const LB_TO_KG = 0.45359237;

const convertWeight = (weight, fromUnit, toUnit) => {
  const value = Number(weight);

  if (fromUnit === toUnit) return value;
  if (fromUnit === "lb" && toUnit === "kg") return value * LB_TO_KG;
  if (fromUnit === "kg" && toUnit === "lb") return value / LB_TO_KG;

  return value;
};

export const useExerciseHistory = (exerciseId) => {
  const [series, setSeries] = useState([]);
  const [unit, setUnit] = useState("kg");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("set_progress")
        .select("set_number, weight, weight_unit, recorded_at")
        .eq("exercise_id", exerciseId)
        .order("recorded_at", { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setSeries([]);
        setLoading(false);
        return;
      }

      const rows = (data ?? []).filter((row) => row.weight != null);
      const units = new Set(rows.map((row) => row.weight_unit));
      const chartUnit = units.size === 1 ? [...units][0] : "kg";
      const bySetNumber = new Map();

      for (const row of rows) {
        const points = bySetNumber.get(row.set_number) ?? [];
        points.push({
          x: new Date(row.recorded_at).getTime(),
          y: convertWeight(row.weight, row.weight_unit, chartUnit),
        });
        bySetNumber.set(row.set_number, points);
      }

      const nextSeries = Array.from({ length: SET_COUNT }, (_, index) => {
        const setNumber = index + 1;

        return {
          setNumber,
          points: (bySetNumber.get(setNumber) ?? []).slice(-HISTORY_LIMIT),
        };
      }).filter((entry) => entry.points.length > 0);

      setUnit(chartUnit);
      setSeries(nextSeries);
      setLoading(false);
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  return { series, unit, loading, error };
};
