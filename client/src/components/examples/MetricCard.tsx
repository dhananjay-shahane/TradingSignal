import { MetricCard } from "../MetricCard";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background">
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
  );
}
