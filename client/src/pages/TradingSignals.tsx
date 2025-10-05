import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignalForm } from "@/components/SignalForm";
import { SignalsTable, Signal } from "@/components/SignalsTable";
import { Plus } from "lucide-react";

const initialSignals: Signal[] = [
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
  {
    id: "4",
    symbol: "BNBUSDT",
    entryPrice: 312.45,
    qty: 3.1987,
    amount: 999.45,
    status: "active",
    createdAt: "2025-01-03T08:45:00Z",
  },
  {
    id: "5",
    symbol: "ADAUSDT",
    entryPrice: 0.4523,
    qty: 2209.8145,
    amount: 999.68,
    status: "active",
    createdAt: "2025-01-02T16:20:00Z",
  },
];

export default function TradingSignals() {
  const [formOpen, setFormOpen] = useState(false);
  const [signals, setSignals] = useState(initialSignals);

  const handleAddSignal = (data: any) => {
    const newSignal: Signal = {
      id: String(signals.length + 1),
      symbol: data.symbol,
      entryPrice: parseFloat(data.entryPrice),
      qty: parseFloat(data.qty),
      amount: parseFloat(data.amount),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setSignals([newSignal, ...signals]);
  };

  const handleEditSignal = (signal: Signal) => {
    console.log("Edit signal:", signal);
  };

  const handleDeleteSignal = (id: string) => {
    setSignals(signals.filter((s) => s.id !== id));
    console.log("Deleted signal:", id);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    setSignals(signals.map(s => 
      s.id === id ? { ...s, status: isActive ? "active" : "pending" as const } : s
    ));
    console.log(`Signal ${id} status changed to ${isActive ? 'active' : 'pending'}`);
  };

  const handleCloseSignal = (id: string) => {
    setSignals(signals.map(s => 
      s.id === id ? { ...s, status: "closed" as const } : s
    ));
    console.log(`Signal ${id} closed`);
  };

  const handleExportCSV = () => {
    console.log("Exporting signals to CSV...");
    const csvContent = [
      ["Symbol", "Entry Price", "Quantity", "Amount", "Status", "Created"],
      ...signals.map((s) => [
        s.symbol,
        s.entryPrice,
        s.qty,
        s.amount,
        s.status,
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trading-signals.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Trading Signals</h1>
          <p className="text-sm text-muted-foreground">
            Manage your trading signals with smart quantity/amount calculations
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)} data-testid="button-add-signal">
          <Plus className="h-4 w-4 mr-2" />
          Add Signal
        </Button>
      </div>

      <SignalsTable
        signals={signals}
        onEdit={handleEditSignal}
        onDelete={handleDeleteSignal}
        onExportCSV={handleExportCSV}
        onToggleStatus={handleToggleStatus}
        onCloseSignal={handleCloseSignal}
      />

      <SignalForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleAddSignal} />
    </div>
  );
}
