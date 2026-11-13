import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Text as SvgText,
} from "react-native-svg";

const CHART_HEIGHT = 220;
const MARGIN = { top: 12, right: 12, bottom: 36, left: 44 };
const COLORS = ["#0a7ea4", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatWeight = (value) => `${Number(value.toFixed(1))}`;

const buildPath = (points, scaleX, scaleY) =>
  points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${scaleX(point.x)} ${scaleY(point.y)}`,
    )
    .join(" ");

const WeightProgressChart = ({ series }) => {
  const [width, setWidth] = useState(0);

  if (series.length === 0) {
    return <Text style={styles.empty}>No progress history yet</Text>;
  }

  const allPoints = series.flatMap((entry) => entry.points);
  const rawMinX = allPoints.reduce(
    (min, point) => Math.min(min, point.x),
    allPoints[0].x,
  );
  const rawMaxX = allPoints.reduce(
    (max, point) => Math.max(max, point.x),
    allPoints[0].x,
  );
  const rawMinY = allPoints.reduce(
    (min, point) => Math.min(min, point.y),
    allPoints[0].y,
  );
  const rawMaxY = allPoints.reduce(
    (max, point) => Math.max(max, point.y),
    allPoints[0].y,
  );

  const xPadding = rawMinX === rawMaxX ? 24 * 60 * 60 * 1000 : 0;
  const minX = rawMinX - xPadding;
  const maxX = rawMaxX + xPadding;
  const yPadding = Math.max((rawMaxY - rawMinY) * 0.15, 2.5);
  const minY = Math.max(0, rawMinY - yPadding);
  const maxY = rawMaxY + yPadding;

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 1);
  const plotHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  const scaleX = (value) =>
    MARGIN.left + ((value - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (value) =>
    MARGIN.top +
    plotHeight -
    ((value - minY) / (maxY - minY)) * plotHeight;

  const yTicks = Array.from(
    { length: 5 },
    (_, index) => minY + ((maxY - minY) * index) / 4,
  );
  const xTicks = Array.from(
    { length: 4 },
    (_, index) => minX + ((maxX - minX) * index) / 3,
  );
  const sameDay =
    new Date(minX).toDateString() === new Date(maxX).toDateString();
  const formatX = sameDay ? formatTime : formatDate;

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 ? (
        <>
          <Svg width={width} height={CHART_HEIGHT}>
            {yTicks.map((tick, index) => (
              <Line
                key={`grid-${index}`}
                x1={MARGIN.left}
                y1={scaleY(tick)}
                x2={MARGIN.left + plotWidth}
                y2={scaleY(tick)}
                stroke="#eee"
                strokeWidth={1}
              />
            ))}

            <Line
              x1={MARGIN.left}
              y1={MARGIN.top}
              x2={MARGIN.left}
              y2={MARGIN.top + plotHeight}
              stroke="#999"
              strokeWidth={1}
            />
            <Line
              x1={MARGIN.left}
              y1={MARGIN.top + plotHeight}
              x2={MARGIN.left + plotWidth}
              y2={MARGIN.top + plotHeight}
              stroke="#999"
              strokeWidth={1}
            />

            {yTicks.map((tick, index) => (
              <SvgText
                key={`y-label-${index}`}
                x={MARGIN.left - 8}
                y={scaleY(tick) + 4}
                fontSize={10}
                fill="#666"
                textAnchor="end"
              >
                {formatWeight(tick)}
              </SvgText>
            ))}

            {xTicks.map((tick, index) => (
              <SvgText
                key={`x-label-${index}`}
                x={scaleX(tick)}
                y={CHART_HEIGHT - 10}
                fontSize={10}
                fill="#666"
                textAnchor="middle"
              >
                {formatX(tick)}
              </SvgText>
            ))}

            {series.map((entry) => {
              const color = COLORS[(entry.setNumber - 1) % COLORS.length];

              return (
                <G key={entry.setNumber}>
                  {entry.points.length > 1 ? (
                    <Path
                      d={buildPath(entry.points, scaleX, scaleY)}
                      stroke={color}
                      strokeWidth={2}
                      fill="none"
                    />
                  ) : null}

                  {entry.points.map((point, index) => (
                    <Circle
                      key={`${entry.setNumber}-${index}`}
                      cx={scaleX(point.x)}
                      cy={scaleY(point.y)}
                      r={3}
                      fill={color}
                    />
                  ))}
                </G>
              );
            })}
          </Svg>

          <View style={styles.legend}>
            {series.map((entry) => (
              <View key={entry.setNumber} style={styles.legendItem}>
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        COLORS[(entry.setNumber - 1) % COLORS.length],
                    },
                  ]}
                />
                <Text style={styles.legendText}>Set {entry.setNumber}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 24,
    textAlign: "center",
    color: "#666",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
  },
});

export default WeightProgressChart;
