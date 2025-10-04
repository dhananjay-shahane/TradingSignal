import { useState } from "react";
import { SignalForm } from "../SignalForm";
import { Button } from "@/components/ui/button";

export default function SignalFormExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8 bg-background">
      <Button onClick={() => setOpen(true)} data-testid="button-open-form">
        Open Signal Form
      </Button>
      <SignalForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => console.log("Form submitted:", data)}
      />
    </div>
  );
}
