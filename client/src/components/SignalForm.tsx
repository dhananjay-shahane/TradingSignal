import { useState } from "react";
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

export function SignalForm({ open, onOpenChange, onSubmit }: SignalFormProps) {
  const [isAmountMode, setIsAmountMode] = useState(false);

  const form = useForm<z.infer<typeof signalFormSchema>>({
    resolver: zodResolver(signalFormSchema),
    defaultValues: {
      symbol: "",
      entryPrice: "",
      qty: "",
      amount: "",
    },
  });

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

  const handleSubmit = (data: z.infer<typeof signalFormSchema>) => {
    console.log("Signal submitted:", data);
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-signal-form">
        <DialogHeader>
          <DialogTitle>Add Trading Signal</DialogTitle>
          <DialogDescription>
            Create a new trading signal with calculated quantity or amount
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., BTCUSDT"
                      {...field}
                      data-testid="input-symbol"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
