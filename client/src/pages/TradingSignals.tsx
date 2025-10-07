import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SignalForm, Signal } from "@/components/SignalForm";
import { SignalsTable } from "@/components/SignalsTable";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TradeSignal } from "@shared/schema";

export default function TradingSignals() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Signal | null>(null);

  const { data: dbSignals = [], isLoading } = useQuery<TradeSignal[]>({
    queryKey: ["/api/trade-signals"],
  });

  // Transform database signals to match table format
  const signals: Signal[] = dbSignals
    .filter((s) => s.symbol && s.ep && s.qty)
    .map((s) => ({
      id: String(s.id),
      symbol: s.symbol!,
      entryPrice: parseFloat(s.ep!),
      qty: parseFloat(s.qty!),
      amount: parseFloat(s.ep!) * parseFloat(s.qty!),
      status: "active" as const,
      createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
    }));

  const handleAddSignal = (data: any) => {
    console.log("Add signal:", data);
  };

  const handleEditSignal = (signal: Signal) => {
    setEditingSignal(signal);
    setFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingSignal(null);
    }
  };

  const handleDeleteSignal = (id: string) => {
    console.log("Deleted signal:", id);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    console.log(`Signal ${id} status changed to ${isActive ? 'active' : 'pending'}`);
  };

  const handleCloseSignal = (id: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Trading Signals</h1>
            <p className="text-sm text-muted-foreground">
              Manage your trading signals with smart quantity/amount calculations
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Loading signals...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <SignalForm 
        open={formOpen} 
        onOpenChange={handleFormClose} 
        onSubmit={handleAddSignal}
        editSignal={editingSignal}
      />
    </div>
  );
}
