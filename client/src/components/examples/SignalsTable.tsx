import { SignalsTable, Signal } from "../SignalsTable";

const mockSignals: Signal[] = [
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

export default function SignalsTableExample() {
  return (
    <div className="p-6 bg-background">
      <SignalsTable
        signals={mockSignals}
        onEdit={(signal) => console.log("Edit signal:", signal)}
        onDelete={(id) => console.log("Delete signal:", id)}
        onExportCSV={() => console.log("Export CSV triggered")}
      />
    </div>
  );
}
