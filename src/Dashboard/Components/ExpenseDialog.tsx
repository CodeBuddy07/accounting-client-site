import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, DollarSign } from "lucide-react";
import { useAddTransaction } from "@/hooks/useTransaction";

export function ExpenseDialog({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [open, setOpen] = useState(false);

  const { mutate: addTransaction, isPending: transactionPending } = useAddTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTransaction({
      type: "expense",
      note: `${name} - ${note}`,
      total: parseInt(amount),
      date,
      paymentType: "cash",

    }, {
      onSuccess: () => {
        setOpen(false);
        setName("");
        setNote("");
        setAmount("");
        setDate(new Date());
      }
    });

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name Field - Left Column */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Expense Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Office Supplies"
                className="h-10 text-sm"
                required
              />
            </div>

            {/* Date Picker - Right Column */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date *
              </Label>
              <div className="relative">
                <div className="relative">
                  <Input
                    id="date"
                    type="text"
                    readOnly
                    value={date ? format(date, "PPP") : ""}
                    placeholder="Select date"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full h-10 text-sm cursor-pointer"
                  />
                  <CalendarIcon
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                  />
                </div>

                {showDatePicker && (
                  <div className="absolute z-10 mt-1 bg-white dark:bg-stone-950 shadow-lg rounded-md border border-gray-200 dark:border-stone-700">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate) {
                          setDate(newDate);
                          setShowDatePicker(false);
                        }
                      }}
                      initialFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Amount Field - Left Column */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"> <DollarSign size={12} /> </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-10 text-sm pl-8"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Note Field - Right Column */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Note
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Additional details about this expense..."
                className="min-h-[80px] text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 px-4 text-sm"
            >
              Cancel
            </Button>
            <Button
             type="submit" 
             className="h-10 px-4 text-sm"
             disabled={transactionPending}
             >
              {transactionPending ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}