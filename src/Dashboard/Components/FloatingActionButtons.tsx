import { useState } from "react";
import { ShoppingCart, DollarSign, Plus, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellDialog } from "./SellDialog";
import { BuyDialog } from "./BuyDialog";
import { ExpenseDialog } from "./ExpenseDialog";

const FloatingActions = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
            {isOpen && (
                <div className="flex flex-col gap-2 animate-in fade-in">
                    <BuyDialog>
                        <Button
                            variant="outline"
                            className="flex items-center justify-start gap-2 w-full"
                        >
                            <ShoppingCart size={18} />
                            <span>Buy</span>
                        </Button>
                    </BuyDialog>
                    <SellDialog>
                        <Button
                            variant="outline"
                            className="flex items-center justify-start gap-2 w-full"
                        >
                            <DollarSign size={18} />
                            <span>Sell</span>
                        </Button>
                    </SellDialog>
                    <ExpenseDialog>
                        <Button
                            variant="outline"
                            className="flex items-center justify-start gap-2 w-full"
                        >
                            <CreditCard size={18} />
                            <span>Expense</span>
                        </Button>
                    </ExpenseDialog>
                </div>
            )}

            <Button
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Plus size={24} />}
            </Button>
        </div>
    );
};

export default FloatingActions;