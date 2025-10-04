import { MetricCard } from "@/components/MetricCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { SignalsTable, Signal } from "@/components/SignalsTable";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const mockChartData = [
  { date: "Jan 1", signals: 45, profit: 12.5 },
  { date: "Jan 8", signals: 52, profit: 15.2 },
  { date: "Jan 15", signals: 48, profit: 11.8 },
  { date: "Jan 22", signals: 61, profit: 18.4 },
  { date: "Jan 29", signals: 58, profit: 16.9 },
  { date: "Feb 5", signals: 67, profit: 21.3 },
  { date: "Feb 12", signals: 63, profit: 19.7 },
];

const recentSignals: Signal[] = [
  {
    id: "1",
    symbol: "BTCUSDT",
    entryPrice: 43250.50,
    qty: 0.0231,
    amount: 999.08,
    status: "active",
    createdAt: "2025-01-03T10:30:00Z",
  },
  {
    id: "2",
    symbol: "ETHUSDT",
    entryPrice: 2245.75,
    qty: 0.8895,
    amount: 1997.56,
    status: "closed",
    createdAt: "2025-01-02T14:20:00Z",
  },
  {
    id: "3",
    symbol: "SOLUSDT",
    entryPrice: 98.42,
    qty: 10.1523,
    amount: 999.18,
    status: "pending",
    createdAt: "2025-01-03T09:15:00Z",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your trading signals performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Signals"
          value="1,284"
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          testId="card-total-signals"
        />
        <MetricCard
          title="Active Users"
          value="342"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          testId="card-active-users"
        />
        <MetricCard
          title="Success Rate"
          value="73.4%"
          icon={DollarSign}
          trend={{ value: -2.1, isPositive: false }}
          testId="card-success-rate"
        />
      </div>

      <PerformanceChart data={mockChartData} />

      <div>
        <h2 className="text-lg font-medium mb-4">Recent Signals</h2>
        <SignalsTable
          signals={recentSignals}
          onEdit={(signal) => console.log("Edit signal:", signal)}
          onDelete={(id) => console.log("Delete signal:", id)}
          onExportCSV={() => console.log("Export CSV triggered")}
        />
      </div>
    </div>
  );
}
