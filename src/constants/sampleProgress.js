import { HISTORY_LIMIT } from "./chart";

export const USE_SAMPLE_PROGRESS = false;
export const SAMPLE_PROGRESS_UNIT = "kg";

const weeklyDates = (startDay) =>
  Array.from({ length: 12 }, (_, index) =>
    Date.UTC(2026, 7, 17 + startDay + index * 7, 10, 0, 0),
  );

const buildSeries = (setNumber, dates, weights) => ({
  setNumber,
  points: weights
    .map((weight, index) => ({
      x: dates[index],
      y: weight,
    }))
    .slice(-HISTORY_LIMIT),
});

export const SAMPLE_PROGRESS_SERIES = [
  buildSeries(
    1,
    weeklyDates(1),
    [52.5, 55, 57.5, 57.5, 60, 62.5, 62.5, 65, 67.5, 70, 70, 72.5],
  ),
  buildSeries(
    2,
    weeklyDates(2),
    [50, 52.5, 55, 57.5, 57.5, 60, 60, 62.5, 62.5, 65, 65, 67.5],
  ),
  buildSeries(
    3,
    weeklyDates(3),
    [47.5, 50, 52.5, 55, 55, 57.5, 57.5, 60, 60, 62.5, 62.5, 65],
  ),
  buildSeries(
    4,
    weeklyDates(4),
    [45, 47.5, 50, 52.5, 52.5, 55, 55, 57.5, 57.5, 60, 60, 62.5],
  ),
  buildSeries(
    5,
    weeklyDates(5),
    [42.5, 45, 47.5, 50, 50, 52.5, 52.5, 55, 55, 57.5, 57.5, 60],
  ),
];
