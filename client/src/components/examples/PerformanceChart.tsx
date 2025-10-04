import { PerformanceChart } from "../PerformanceChart";

const mockData = [
  { date: "Jan 1", signals: 45, profit: 12.5 },
  { date: "Jan 8", signals: 52, profit: 15.2 },
  { date: "Jan 15", signals: 48, profit: 11.8 },
  { date: "Jan 22", signals: 61, profit: 18.4 },
  { date: "Jan 29", signals: 58, profit: 16.9 },
  { date: "Feb 5", signals: 67, profit: 21.3 },
  { date: "Feb 12", signals: 63, profit: 19.7 },
];

export default function PerformanceChartExample() {
  return (
    <div className="p-6 bg-background">
      <PerformanceChart data={mockData} />
    </div>
  );
}
