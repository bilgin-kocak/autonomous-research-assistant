// Mock time-series data for charts
export interface TimeSeriesDataPoint {
  time: string;
  value: number;
}

export const generateTimeSeriesData = (
  baseValue: number,
  days: number = 30
): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate realistic variation (±20% of base value)
    const variation = (Math.random() - 0.5) * 0.4 * baseValue;
    const value = Math.max(0, Math.round(baseValue + variation));

    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value,
    });
  }

  return data;
};

export const getMockChartData = () => {
  return {
    papers: generateTimeSeriesData(1284, 30),
    hypotheses: generateTimeSeriesData(567, 30),
  };
};
