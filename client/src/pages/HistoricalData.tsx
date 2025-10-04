import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PerformanceChart } from "@/components/PerformanceChart";
import { Download } from "lucide-react";

const mockHistoricalData = [
  { date: "Dec 1", signals: 38, profit: 9.2 },
  { date: "Dec 8", signals: 42, profit: 11.5 },
  { date: "Dec 15", signals: 39, profit: 8.7 },
  { date: "Dec 22", signals: 45, profit: 13.8 },
  { date: "Dec 29", signals: 51, profit: 16.2 },
  { date: "Jan 1", signals: 45, profit: 12.5 },
  { date: "Jan 8", signals: 52, profit: 15.2 },
  { date: "Jan 15", signals: 48, profit: 11.8 },
  { date: "Jan 22", signals: 61, profit: 18.4 },
  { date: "Jan 29", signals: 58, profit: 16.9 },
  { date: "Feb 5", signals: 67, profit: 21.3 },
  { date: "Feb 12", signals: 63, profit: 19.7 },
];

export default function HistoricalData() {
  const [startDate, setStartDate] = useState("2024-12-01");
  const [endDate, setEndDate] = useState("2025-02-12");

  const handleExport = () => {
    console.log("Exporting historical data...");
    const csvContent = [
      ["Date", "Signals", "Profit %"],
      ...mockHistoricalData.map((d) => [d.date, d.signals, d.profit]),
    ]
      .map((row) => row.join(","))
      .join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historical-data.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Historical Data</h1>
        <p className="text-sm text-muted-foreground">
          View and export historical trading performance data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Range Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                data-testid="input-start-date"
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                data-testid="input-end-date"
              />
            </div>
            <Button variant="outline" onClick={handleExport} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <PerformanceChart data={mockHistoricalData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">596</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across selected period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono text-chart-2">14.6%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per period average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">Feb 5</div>
            <p className="text-xs text-chart-2 mt-1">
              21.3% profit, 67 signals
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
