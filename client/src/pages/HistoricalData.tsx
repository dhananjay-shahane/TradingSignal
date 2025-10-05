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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  lastUpdate7d: string;
  lastUpdate30d: string;
  lastUpdate5min: string;
  status7d: "processing" | "completed" | "pending";
  status30d: "processing" | "completed" | "pending";
  status5min: "processing" | "completed" | "pending";
}

const initialSymbols: SymbolData[] = [
  {
    id: "1",
    symbol: "BTCUSDT",
    cmp7d: 43250.50,
    cmp30d: 41200.30,
    cmp5min: 43255.80,
    lastUpdate7d: new Date().toISOString(),
    lastUpdate30d: new Date().toISOString(),
    lastUpdate5min: new Date().toISOString(),
    status7d: "completed",
    status30d: "completed",
    status5min: "completed",
  },
  {
    id: "2",
    symbol: "ETHUSDT",
    cmp7d: 2245.75,
    cmp30d: 2180.40,
    cmp5min: 2246.20,
    lastUpdate7d: new Date().toISOString(),
    lastUpdate30d: new Date().toISOString(),
    lastUpdate5min: new Date().toISOString(),
    status7d: "completed",
    status30d: "completed",
    status5min: "completed",
  },
  {
    id: "3",
    symbol: "SOLUSDT",
    cmp7d: null,
    cmp30d: null,
    cmp5min: null,
    lastUpdate7d: new Date().toISOString(),
    lastUpdate30d: new Date().toISOString(),
    lastUpdate5min: new Date().toISOString(),
    status7d: "pending",
    status30d: "pending",
    status5min: "pending",
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
  const [isScript5minRunning, setIsScript5minRunning] = useState(false);
  const [isScript7dRunning, setIsScript7dRunning] = useState(false);
  const [isScript30dRunning, setIsScript30dRunning] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("5min");
  const [scriptLog5min, setScriptLog5min] = useState<string[]>([]);
  const [scriptLog7d, setScriptLog7d] = useState<string[]>([]);
  const [scriptLog30d, setScriptLog30d] = useState<string[]>([]);

  const handleStartScript = (type: "5min" | "7d" | "30d") => {
    if (type === "5min") {
      setIsScript5minRunning(true);
      setScriptLog5min(["5min script started...", "Connecting to data source..."]);
    } else if (type === "7d") {
      setIsScript7dRunning(true);
      setScriptLog7d(["7d script started...", "Connecting to data source..."]);
    } else {
      setIsScript30dRunning(true);
      setScriptLog30d(["30d script started...", "Connecting to data source..."]);
    }
    
    toast({
      title: `${type.toUpperCase()} Script started`,
      description: `${type} data collection script is now running`,
    });

    const logMessages = [
      `Processing BTCUSDT - ${type} data...`,
      `BTCUSDT ${type} data received ✓`,
      `Processing ETHUSDT - ${type} data...`,
      `ETHUSDT ${type} data received ✓`,
    ];

    logMessages.forEach((msg, index) => {
      setTimeout(() => {
        if (type === "5min") {
          setScriptLog5min(prev => [...prev, msg]);
        } else if (type === "7d") {
          setScriptLog7d(prev => [...prev, msg]);
        } else {
          setScriptLog30d(prev => [...prev, msg]);
        }
      }, (index + 1) * 1000);
    });
  };

  const handleStopScript = (type: "5min" | "7d" | "30d") => {
    if (type === "5min") {
      setIsScript5minRunning(false);
      setScriptLog5min(prev => [...prev, "Script stopped by user"]);
    } else if (type === "7d") {
      setIsScript7dRunning(false);
      setScriptLog7d(prev => [...prev, "Script stopped by user"]);
    } else {
      setIsScript30dRunning(false);
      setScriptLog30d(prev => [...prev, "Script stopped by user"]);
    }
    
    toast({
      title: `${type.toUpperCase()} Script stopped`,
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
      lastUpdate7d: new Date().toISOString(),
      lastUpdate30d: new Date().toISOString(),
      lastUpdate5min: new Date().toISOString(),
      status7d: "pending",
      status30d: "pending",
      status5min: "pending",
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

  const getCmpBadge = (value: number | null) => {
    if (value === null) {
      return <span className="text-muted-foreground">-</span>;
    }
    
    return <span className="font-mono text-chart-1">${value.toFixed(2)}</span>;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Historical Data</h1>
        <p className="text-sm text-muted-foreground">
          Manage symbol data collection and view historical performance
        </p>
      </div>

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
              <Button onClick={handleAddSymbol} data-testid="button-add-symbol" className="shrink-0">
                <Plus className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Add</span>
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="5min" data-testid="tab-5min">5 Minutes</TabsTrigger>
          <TabsTrigger value="7d" data-testid="tab-7d">7 Days</TabsTrigger>
          <TabsTrigger value="30d" data-testid="tab-30d">30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value="5min" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>5 Min Script Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStartScript("5min")}
                  disabled={isScript5minRunning}
                  className="flex-1"
                  data-testid="button-start-script-5min"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start 5min Script
                </Button>
                <Button
                  onClick={() => handleStopScript("5min")}
                  disabled={!isScript5minRunning}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-script-5min"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>

              {isScript5minRunning && (
                <div className="flex items-center gap-2 text-sm text-chart-2">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Script is running...
                </div>
              )}

              <div className="bg-muted/50 rounded-md p-3 max-h-40 overflow-y-auto">
                <p className="text-xs font-mono text-muted-foreground mb-2">Script Log:</p>
                {scriptLog5min.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                ) : (
                  <div className="space-y-1">
                    {scriptLog5min.map((log, index) => (
                      <p key={index} className="text-xs font-mono">
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

        <TabsContent value="7d" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7 Day Script Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStartScript("7d")}
                  disabled={isScript7dRunning}
                  className="flex-1"
                  data-testid="button-start-script-7d"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start 7d Script
                </Button>
                <Button
                  onClick={() => handleStopScript("7d")}
                  disabled={!isScript7dRunning}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-script-7d"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>

              {isScript7dRunning && (
                <div className="flex items-center gap-2 text-sm text-chart-2">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Script is running...
                </div>
              )}

              <div className="bg-muted/50 rounded-md p-3 max-h-40 overflow-y-auto">
                <p className="text-xs font-mono text-muted-foreground mb-2">Script Log:</p>
                {scriptLog7d.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                ) : (
                  <div className="space-y-1">
                    {scriptLog7d.map((log, index) => (
                      <p key={index} className="text-xs font-mono">
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

        <TabsContent value="30d" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30 Day Script Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStartScript("30d")}
                  disabled={isScript30dRunning}
                  className="flex-1"
                  data-testid="button-start-script-30d"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start 30d Script
                </Button>
                <Button
                  onClick={() => handleStopScript("30d")}
                  disabled={!isScript30dRunning}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-stop-script-30d"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>

              {isScript30dRunning && (
                <div className="flex items-center gap-2 text-sm text-chart-2">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Script is running...
                </div>
              )}

              <div className="bg-muted/50 rounded-md p-3 max-h-40 overflow-y-auto">
                <p className="text-xs font-mono text-muted-foreground mb-2">Script Log:</p>
                {scriptLog30d.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No activity yet</p>
                ) : (
                  <div className="space-y-1">
                    {scriptLog30d.map((log, index) => (
                      <p key={index} className="text-xs font-mono">
                        {log}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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
      </Tabs>
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getCmpValue = (symbol: SymbolData) => {
    if (activeTab === "7d") return symbol.cmp7d;
    if (activeTab === "30d") return symbol.cmp30d;
    return symbol.cmp5min;
  };

  const getStatus = (symbol: SymbolData) => {
    if (activeTab === "7d") return symbol.status7d;
    if (activeTab === "30d") return symbol.status30d;
    return symbol.status5min;
  };

  const getLastUpdate = (symbol: SymbolData) => {
    if (activeTab === "7d") return symbol.lastUpdate7d;
    if (activeTab === "30d") return symbol.lastUpdate30d;
    return symbol.lastUpdate5min;
  };

  const totalPages = Math.ceil(symbols.length / itemsPerPage);
  const clampedPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (clampedPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSymbols = symbols.slice(startIndex, endIndex);

  if (currentPage !== clampedPage && totalPages > 0) {
    setCurrentPage(clampedPage);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symbol Data Updates - {activeTab.toUpperCase()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Symbol</TableHead>
                <TableHead className="whitespace-nowrap">CMP Value</TableHead>
                <TableHead className="whitespace-nowrap">Last Update</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSymbols.map((symbol: SymbolData) => (
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
                              className={`h-4 w-4 transition-transform shrink-0 ${
                                expandedSymbol === symbol.id ? "rotate-180" : ""
                              }`}
                            />
                            <span className="whitespace-nowrap">{symbol.symbol}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{getCmpBadge(getCmpValue(symbol))}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(getLastUpdate(symbol)).toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(getStatus(symbol))}</TableCell>
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

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  data-testid="pagination-prev"
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                    data-testid={`pagination-page-${i + 1}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  data-testid="pagination-next"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
