import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const signalFormSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  entryPrice: z.string().min(1, "Entry price is required"),
  qty: z.string().min(1, "Quantity is required"),
  amount: z.string().min(1, "Amount is required"),
});

interface SignalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

interface SymbolSuggestion {
  symbol: string;
  company: string;
  sector: string;
  subSector: string;
  category: "Nifty" | "Nifty 500" | "ETF";
}

const mockSymbols: SymbolSuggestion[] = [
  { symbol: "RELIANCE", company: "Reliance Industries", sector: "Energy", subSector: "Oil & Gas", category: "Nifty" },
  { symbol: "TCS", company: "Tata Consultancy Services", sector: "IT", subSector: "Software", category: "Nifty" },
  { symbol: "HDFCBANK", company: "HDFC Bank", sector: "Financial", subSector: "Banking", category: "Nifty" },
  { symbol: "INFY", company: "Infosys", sector: "IT", subSector: "Software", category: "Nifty" },
  { symbol: "ICICIBANK", company: "ICICI Bank", sector: "Financial", subSector: "Banking", category: "Nifty" },
  { symbol: "HINDUNILVR", company: "Hindustan Unilever", sector: "FMCG", subSector: "Consumer Goods", category: "Nifty" },
  { symbol: "ITC", company: "ITC Limited", sector: "FMCG", subSector: "Tobacco", category: "Nifty" },
  { symbol: "SBIN", company: "State Bank of India", sector: "Financial", subSector: "Banking", category: "Nifty" },
  { symbol: "BHARTIARTL", company: "Bharti Airtel", sector: "Telecom", subSector: "Telecom Services", category: "Nifty" },
  { symbol: "KOTAKBANK", company: "Kotak Mahindra Bank", sector: "Financial", subSector: "Banking", category: "Nifty" },
  { symbol: "ASIANPAINT", company: "Asian Paints", sector: "Consumer", subSector: "Paints", category: "Nifty 500" },
  { symbol: "MARUTI", company: "Maruti Suzuki", sector: "Auto", subSector: "Automobile", category: "Nifty 500" },
  { symbol: "TITAN", company: "Titan Company", sector: "Consumer", subSector: "Jewelry", category: "Nifty 500" },
  { symbol: "SUNPHARMA", company: "Sun Pharmaceutical", sector: "Healthcare", subSector: "Pharma", category: "Nifty 500" },
  { symbol: "NESTLEIND", company: "Nestle India", sector: "FMCG", subSector: "Food Products", category: "Nifty 500" },
  { symbol: "NIFTYBEES", company: "Nippon India ETF Nifty BeES", sector: "ETF", subSector: "Index ETF", category: "ETF" },
  { symbol: "JUNIORBEES", company: "Nippon India ETF Junior BeES", sector: "ETF", subSector: "Index ETF", category: "ETF" },
  { symbol: "GOLDBEES", company: "Nippon India ETF Gold BeES", sector: "ETF", subSector: "Commodity ETF", category: "ETF" },
  { symbol: "BANKBEES", company: "Nippon India ETF Bank BeES", sector: "ETF", subSector: "Sector ETF", category: "ETF" },
];

export function SignalForm({ open, onOpenChange, onSubmit }: SignalFormProps) {
  const [isAmountMode, setIsAmountMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(["Nifty"]));
  const [filterType, setFilterType] = useState<string>("company");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<SymbolSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const form = useForm<z.infer<typeof signalFormSchema>>({
    resolver: zodResolver(signalFormSchema),
    defaultValues: {
      symbol: "",
      entryPrice: "",
      qty: "",
      amount: "",
    },
  });

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let filtered = mockSymbols;

    if (selectedCategories.size > 0) {
      filtered = filtered.filter(s => selectedCategories.has(s.category));
    }

    const lowerSearch = searchTerm.toLowerCase();
    filtered = filtered.filter(s => {
      if (filterType === "company") {
        return s.company.toLowerCase().includes(lowerSearch) || 
               s.symbol.toLowerCase().includes(lowerSearch);
      } else if (filterType === "sector") {
        return s.sector.toLowerCase().includes(lowerSearch);
      } else {
        return s.subSector.toLowerCase().includes(lowerSearch);
      }
    });

    setFilteredSuggestions(filtered.slice(0, 8));
    setShowSuggestions(filtered.length > 0);
  }, [searchTerm, selectedCategories, filterType]);

  const calculateQty = (amount: string, entryPrice: string) => {
    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(entryPrice);
    if (amountNum && priceNum) {
      return (amountNum / priceNum).toFixed(4);
    }
    return "";
  };

  const calculateAmount = (qty: string, entryPrice: string) => {
    const qtyNum = parseFloat(qty);
    const priceNum = parseFloat(entryPrice);
    if (qtyNum && priceNum) {
      return (qtyNum * priceNum).toFixed(2);
    }
    return "";
  };

  const handleAmountChange = (value: string) => {
    form.setValue("amount", value);
    const entryPrice = form.getValues("entryPrice");
    if (entryPrice) {
      const calculatedQty = calculateQty(value, entryPrice);
      form.setValue("qty", calculatedQty);
    }
  };

  const handleQtyChange = (value: string) => {
    form.setValue("qty", value);
    const entryPrice = form.getValues("entryPrice");
    if (entryPrice) {
      const calculatedAmount = calculateAmount(value, entryPrice);
      form.setValue("amount", calculatedAmount);
    }
  };

  const handleSelectSymbol = (symbol: SymbolSuggestion) => {
    form.setValue("symbol", symbol.symbol);
    setSearchTerm(symbol.symbol);
    setShowSuggestions(false);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSubmit = (data: z.infer<typeof signalFormSchema>) => {
    console.log("Signal submitted:", data);
    onSubmit(data);
    form.reset();
    setSearchTerm("");
    setSelectedCategories(new Set(["Nifty"]));
    setFilterType("company");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" data-testid="dialog-signal-form">
        <DialogHeader>
          <DialogTitle>Add Trading Signal</DialogTitle>
          <DialogDescription>
            Create a new trading signal with symbol search and auto-calculation
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <h3 className="text-sm font-semibold">Symbol Search</h3>
              
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Category</Label>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-nifty"
                      checked={selectedCategories.has("Nifty")}
                      onCheckedChange={() => handleCategoryToggle("Nifty")}
                      data-testid="checkbox-category-nifty"
                    />
                    <label
                      htmlFor="category-nifty"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nifty
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-nifty500"
                      checked={selectedCategories.has("Nifty 500")}
                      onCheckedChange={() => handleCategoryToggle("Nifty 500")}
                      data-testid="checkbox-category-nifty500"
                    />
                    <label
                      htmlFor="category-nifty500"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Nifty 500
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="category-etf"
                      checked={selectedCategories.has("ETF")}
                      onCheckedChange={() => handleCategoryToggle("ETF")}
                      data-testid="checkbox-category-etf"
                    />
                    <label
                      htmlFor="category-etf"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      ETF
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Filter By</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger data-testid="select-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="sector">Sector</SelectItem>
                    <SelectItem value="subsector">Sub Sector</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Symbol or Company</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Type symbol or company name..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            field.onChange(e.target.value);
                          }}
                          onFocus={() => searchTerm && setShowSuggestions(true)}
                          data-testid="input-symbol-search"
                        />
                        {showSuggestions && filteredSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 border rounded-md bg-popover shadow-lg">
                            <ScrollArea className="max-h-60">
                              {filteredSuggestions.map((suggestion) => (
                                <div
                                  key={suggestion.symbol}
                                  className="px-3 py-2 cursor-pointer hover-elevate active-elevate-2 border-b last:border-0"
                                  onClick={() => handleSelectSymbol(suggestion)}
                                  data-testid={`suggestion-${suggestion.symbol}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium font-mono text-sm">{suggestion.symbol}</p>
                                      <p className="text-xs text-muted-foreground">{suggestion.company}</p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="outline" className="text-xs mb-1">
                                        {suggestion.category}
                                      </Badge>
                                      <p className="text-xs text-muted-foreground">
                                        {suggestion.sector} • {suggestion.subSector}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start typing to see filtered suggestions based on your category and filter selections
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      data-testid="input-entry-price"
                      onChange={(e) => {
                        field.onChange(e);
                        const entryPrice = e.target.value;
                        if (isAmountMode) {
                          const amount = form.getValues("amount");
                          if (amount) {
                            form.setValue("qty", calculateQty(amount, entryPrice));
                          }
                        } else {
                          const qty = form.getValues("qty");
                          if (qty) {
                            form.setValue("amount", calculateAmount(qty, entryPrice));
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between py-2">
              <Label htmlFor="mode-toggle" className="text-sm font-medium">
                {isAmountMode ? "Amount Mode (Qty auto-calculated)" : "Qty Mode (Amount auto-calculated)"}
              </Label>
              <Switch
                id="mode-toggle"
                checked={isAmountMode}
                onCheckedChange={setIsAmountMode}
                data-testid="switch-mode"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="0.0000"
                        {...field}
                        disabled={isAmountMode}
                        onChange={(e) => {
                          if (!isAmountMode) {
                            handleQtyChange(e.target.value);
                          }
                        }}
                        data-testid="input-qty"
                        className={isAmountMode ? "opacity-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={!isAmountMode}
                        onChange={(e) => {
                          if (isAmountMode) {
                            handleAmountChange(e.target.value);
                          }
                        }}
                        data-testid="input-amount"
                        className={!isAmountMode ? "opacity-50" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" data-testid="button-submit-signal">
              Add Signal
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
