import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowUpDown, Download } from "lucide-react";

export interface Signal {
  id: string;
  symbol: string;
  entryPrice: number;
  qty: number;
  amount: number;
  status: "active" | "closed" | "pending";
  createdAt: string;
}

interface SignalsTableProps {
  signals: Signal[];
  onEdit: (signal: Signal) => void;
  onDelete: (id: string) => void;
  onExportCSV: () => void;
}

export function SignalsTable({ signals, onEdit, onDelete, onExportCSV }: SignalsTableProps) {
  const [sortField, setSortField] = useState<keyof Signal>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterText, setFilterText] = useState("");

  const handleSort = (field: keyof Signal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredSignals = signals.filter((signal) =>
    signal.symbol.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedSignals = [...filteredSignals].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    return aValue > bValue ? modifier : -modifier;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2 text-white";
      case "closed":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-chart-4 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter by symbol..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="max-w-sm"
          data-testid="input-filter"
        />
        <Button variant="outline" onClick={onExportCSV} data-testid="button-export-csv">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("symbol")}
                  className="h-8 px-2"
                  data-testid="sort-symbol"
                >
                  Symbol
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("entryPrice")}
                  className="h-8 px-2"
                  data-testid="sort-entry-price"
                >
                  Entry Price
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSignals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No signals found
                </TableCell>
              </TableRow>
            ) : (
              sortedSignals.map((signal) => (
                <TableRow key={signal.id} data-testid={`row-signal-${signal.id}`}>
                  <TableCell className="font-medium font-mono">{signal.symbol}</TableCell>
                  <TableCell className="font-mono">${signal.entryPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-mono">{signal.qty.toFixed(4)}</TableCell>
                  <TableCell className="text-right font-mono">${signal.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(signal.status)}>
                      {signal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {new Date(signal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(signal)}
                        data-testid={`button-edit-${signal.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(signal.id)}
                        data-testid={`button-delete-${signal.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
