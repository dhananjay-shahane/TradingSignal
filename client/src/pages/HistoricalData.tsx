import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, Square, Upload, Plus, ChevronDown, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymbolData {
  id: string;
  symbol: string;
  cmp7d: number | null;
  cmp30d: number | null;
  cmp5min: number | null;
  lastUpdate: string;
  status: "processing" | "completed" | "pending";
}

const initialSymbols: SymbolData[] = [
  {
    id: "1",
    symbol: "BTCUSDT",
    cmp7d: 43250.50,
    cmp30d: 41200.30,
    cmp5min: 43255.80,
    lastUpdate: new Date().toISOString(),
    status: "completed",
  },
  {
    id: "2",
    symbol: "ETHUSDT",
    cmp7d: 2245.75,
    cmp30d: 2180.40,
    cmp5min: 2246.20,
    lastUpdate: new Date().toISOString(),
    status: "completed",
  },
  {
    id: "3",
    symbol: "SOLUSDT",
    cmp7d: null,
    cmp30d: null,
    cmp5min: null,
    lastUpdate: new Date().toISOString(),
    status: "pending",
  },
];

const mockHistoricalChartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  price: 40000 + Math.random() * 5000,
  volume: 1000000000 + Math.random() * 500000000,
}));

export default function HistoricalData() {
  const { toast } = useToast();
  const [symbols, setSymbols] = useState<SymbolData[]>(initialSymbols);
  const [isScriptRunning, setIsScriptRunning] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("7d");
  const [scriptLog, setScriptLog] = useState<string[]>([]);

  const handleStartScript = () => {
    setIsScriptRunning(true);
    setScriptLog(["Script started...", "Connecting to data source..."]);
    
    toast({
      title: "Script started",
      description: "Data collection script is now running",
    });

    const logMessages = [
      "Processing BTCUSDT - 7d data...",
      "BTCUSDT 7d data received ✓",
      "Processing BTCUSDT - 30d data...",
      "BTCUSDT 30d data received ✓",
      "Processing ETHUSDT - 5min data...",
      "ETHUSDT 5min data received ✓",
    ];

    logMessages.forEach((msg, index) => {
      setTimeout(() => {
        setScriptLog(prev => [...prev, msg]);
      }, (index + 1) * 1000);
    });
  };

  const handleStopScript = () => {
    setIsScriptRunning(false);
    setScriptLog(prev => [...prev, "Script stopped by user"]);
    
    toast({
      title: "Script stopped",
      description: "Data collection has been halted",
    });
  };

  const handleAddSymbol = () => {
    if (!newSymbol.trim()) return;
    
    const newSymbolData: SymbolData = {
      id: String(symbols.length + 1),
      symbol: newSymbol.toUpperCase(),
      cmp7d: null,
      cmp30d: null,
      cmp5min: null,
      lastUpdate: new Date().toISOString(),
      status: "pending",
    };
    
    setSymbols([...symbols, newSymbolData]);
    setNewSymbol("");
    
    toast({
      title: "Symbol added",
      description: `${newSymbol.toUpperCase()} has been added to the list`,
    });
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("Importing CSV file:", file.name);
    
    toast({
      title: "CSV Import",
      description: `Processing ${file.name}...`,
    });
  };

  const handleSkipSymbol = (symbolId: string) => {
    console.log("Skipping symbol:", symbolId);
    toast({
      title: "Symbol skipped",
      description: "Symbol has been skipped for this update cycle",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-chart-2 text-white">Completed</Badge>;
      case "processing":
        return <Badge className="bg-chart-4 text-white">Processing</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
      default:
        return null;
    }
  };

  const getCmpBadge = (value: number | null, type: string) => {
    if (value === null) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    const colorClass = type === "5min" ? "text-chart-1" : type === "7d" ? "text-chart-2" : "text-chart-4";
    return <span className={`font-mono ${colorClass}`}>${value.toFixed(2)}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Historical Data</h1>
        <p className="text-sm text-muted-foreground">
          Manage symbol data collection and view historical performance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Symbol Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new-symbol">Add Single Symbol</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="new-symbol"
                  placeholder="e.g., BTCUSDT"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSymbol()}
                  data-testid="input-new-symbol"
                />
                <Button onClick={handleAddSymbol} data-testid="button-add-symbol">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="csv-upload">Import Symbols from CSV</Label>
              <div className="mt-2">
                <label htmlFor="csv-upload">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV File
                    </span>
                  </Button>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCSVImport}
                    data-testid="input-csv-upload"
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Script Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleStartScript}
                disabled={isScriptRunning}
                className="flex-1"
                data-testid="button-start-script"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Script
              </Button>
              <Button
                onClick={handleStopScript}
                disabled={!isScriptRunning}
                variant="destructive"
                className="flex-1"
                data-testid="button-stop-script"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Script
              </Button>
            </div>

            {isScriptRunning && (
              <div className="flex items-center gap-2 text-sm text-chart-2">
                <Activity className="h-4 w-4 animate-pulse" />
                Script is running...
              </div>
            )}

            <div className="bg-muted/50 rounded-md p-3 max-h-40 overflow-y-auto">
              <p className="text-xs font-mono text-muted-foreground mb-2">Script Log:</p>
              {scriptLog.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity yet</p>
              ) : (
                <div className="space-y-1">
                  {scriptLog.map((log, index) => (
                    <p key={index} className="text-xs font-mono">
                      {log}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Symbol Data Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7d" data-testid="tab-7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d" data-testid="tab-30d">30 Days</TabsTrigger>
              <TabsTrigger value="5min" data-testid="tab-5min">5 Minutes</TabsTrigger>
            </TabsList>

            <TabsContent value="7d" className="mt-4">
              <SymbolDataTable
                symbols={symbols}
                activeTab="7d"
                expandedSymbol={expandedSymbol}
                setExpandedSymbol={setExpandedSymbol}
                getStatusBadge={getStatusBadge}
                getCmpBadge={getCmpBadge}
                handleSkipSymbol={handleSkipSymbol}
              />
            </TabsContent>

            <TabsContent value="30d" className="mt-4">
              <SymbolDataTable
                symbols={symbols}
                activeTab="30d"
                expandedSymbol={expandedSymbol}
                setExpandedSymbol={setExpandedSymbol}
                getStatusBadge={getStatusBadge}
                getCmpBadge={getCmpBadge}
                handleSkipSymbol={handleSkipSymbol}
              />
            </TabsContent>

            <TabsContent value="5min" className="mt-4">
              <SymbolDataTable
                symbols={symbols}
                activeTab="5min"
                expandedSymbol={expandedSymbol}
                setExpandedSymbol={setExpandedSymbol}
                getStatusBadge={getStatusBadge}
                getCmpBadge={getCmpBadge}
                handleSkipSymbol={handleSkipSymbol}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function SymbolDataTable({
  symbols,
  activeTab,
  expandedSymbol,
  setExpandedSymbol,
  getStatusBadge,
  getCmpBadge,
  handleSkipSymbol,
}: any) {
  const getCmpValue = (symbol: SymbolData) => {
    if (activeTab === "7d") return symbol.cmp7d;
    if (activeTab === "30d") return symbol.cmp30d;
    return symbol.cmp5min;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>CMP Value</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {symbols.map((symbol: SymbolData) => (
            <Collapsible
              key={symbol.id}
              open={expandedSymbol === symbol.id}
              onOpenChange={() =>
                setExpandedSymbol(expandedSymbol === symbol.id ? null : symbol.id)
              }
              asChild
            >
              <>
                <CollapsibleTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover-elevate"
                    data-testid={`row-symbol-${symbol.id}`}
                  >
                    <TableCell className="font-medium font-mono">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            expandedSymbol === symbol.id ? "rotate-180" : ""
                          }`}
                        />
                        {symbol.symbol}
                      </div>
                    </TableCell>
                    <TableCell>{getCmpBadge(getCmpValue(symbol), activeTab)}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {new Date(symbol.lastUpdate).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(symbol.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkipSymbol(symbol.id);
                        }}
                        data-testid={`button-skip-${symbol.id}`}
                      >
                        Skip
                      </Button>
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/50">
                      <div className="py-4">
                        <h4 className="text-sm font-medium mb-4">
                          Historical Data - {symbol.symbol}
                        </h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={mockHistoricalChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                              dataKey="date"
                              stroke="hsl(var(--muted-foreground))"
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            />
                            <YAxis
                              stroke="hsl(var(--muted-foreground))"
                              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="hsl(var(--chart-1))"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TableCell>
                  </TableRow>
                </CollapsibleContent>
              </>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
