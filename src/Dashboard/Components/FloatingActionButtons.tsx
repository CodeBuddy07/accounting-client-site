import { useState } from "react";
import { ShoppingCart, DollarSign, Plus, X, CreditCard, Check, ChevronsUpDown, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";



interface SelectedProduct extends Product {
    quantity: number;
    price: number; // Price can be buyingPrice or sellingPrice based on the context
}

// Dummy data
const products: Product[] = [
    { id: 1, name: "Product A", buyingPrice: 100, sellingPrice: 150, note: "" },
    { id: 2, name: "Product B", buyingPrice: 200, sellingPrice: 250, note: "" },
    { id: 3, name: "Product C", buyingPrice: 150, sellingPrice: 200, note: "" },
    { id: 4, name: "Product D", buyingPrice: 300, sellingPrice: 350, note: "" },
];

const customers: Customer[] = [
    { id: 1, name: "Customer X", phone: "1234567890", dues: 0, receivable: 0, note: "" },
    { id: 2, name: "Customer Y", phone: "0987654321", dues: 0, receivable: 0, note: "" },
];

// Reusable Product Selection Component
const ProductSelection = ({ selectedProducts, onSelect, onRemove, onUpdate }: {
    selectedProducts: SelectedProduct[];
    onSelect: (product: Product) => void;
    onRemove: (id: number) => void;
    onUpdate: (id: number, key: keyof SelectedProduct, value: number) => void;
}) => {
    return (
        <div className="space-y-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                        Select Products
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search product..." className="h-9" />
                        <CommandList>
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                                {products.map((product) => (
                                    <CommandItem key={product.id} onSelect={() => onSelect(product)}>
                                        {product.name} - ৳{product.sellingPrice}
                                        <Check className={cn("ml-auto", selectedProducts.some((p) => p.id === product.id) ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected Products List */}
            <div className="space-y-2">
                {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => onUpdate(product.id, "quantity", parseInt(e.target.value))}
                                    className="w-20"
                                />
                                <Input
                                    type="number"
                                    value={product.price}
                                    onChange={(e) => onUpdate(product.id, "price", parseFloat(e.target.value))}
                                    className="w-20"
                                />
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => onRemove(product.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Reusable Entity Selection Component (Customer/Supplier)
const EntitySelection = ({ entities, selectedEntity, onSelect, placeholder }: {
    entities: Customer[];
    selectedEntity: number | null;
    onSelect: (id: number) => void;
    placeholder: string;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    {selectedEntity ? entities.find(e => e.id === selectedEntity)?.name : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        {entities.map((entity) => (
                            <CommandItem key={entity.id} onSelect={() => onSelect(entity.id)}>
                                {entity.name}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

// Reusable Date Picker Component
const DatePicker = ({ selectedDate, onSelect }: {
    selectedDate: Date | null;
    onSelect: (date: Date | null) => void;
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate || undefined} onSelect={(date) => onSelect(date || null)} />
            </PopoverContent>
        </Popover>
    );
};

const FloatingActions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"buy" | "sell" | "expense" | null>(null);

    // Form state
    const [formState, setFormState] = useState<{
        selectedProducts: SelectedProduct[];
        selectedCustomer: number | null;
        date: Date | null;
        expenseName: string;
        expenseAmount: string;
        expenseNote: string;
    }>({
        selectedProducts: [],
        selectedCustomer: null,
        date: new Date(),
        expenseName: "",
        expenseAmount: "",
        expenseNote: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const openDialog = (type: "buy" | "sell" | "expense") => {
        setDialogType(type);
        setIsOpen(false);
        setErrors({}); // Reset errors when opening a new dialog
    };

    const handleProductSelect = (product: Product) => {
        if (!formState.selectedProducts.some((p) => p.id === product.id)) {
            setFormState(prev => ({
                ...prev,
                selectedProducts: [
                    ...prev.selectedProducts,
                    {
                        ...product,
                        quantity: 1,
                        price: dialogType === "buy" ? product.buyingPrice : product.sellingPrice,
                    },
                ],
            }));
        }
    };

    const updateProduct = (id: number, key: keyof SelectedProduct, value: number) => {
        setFormState(prev => ({
            ...prev,
            selectedProducts: prev.selectedProducts.map((item) =>
                item.id === id ? { ...item, [key]: value } : item
            ),
        }));
    };

    const removeProduct = (id: number) => {
        setFormState(prev => ({
            ...prev,
            selectedProducts: prev.selectedProducts.filter((item) => item.id !== id),
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (dialogType === "buy" || dialogType === "sell") {
            if (formState.selectedProducts.length === 0) {
                newErrors.selectedProducts = "Please select at least one product.";
            }
            if (!formState.date) {
                newErrors.date = "Please select a date.";
            }
        } else if (dialogType === "expense") {
            if (!formState.expenseName.trim()) {
                newErrors.expenseName = "Expense name is required.";
            }
            if (!formState.expenseAmount.trim() || isNaN(parseFloat(formState.expenseAmount))) {
                newErrors.expenseAmount = "Valid expense amount is required.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (validateForm()) {
            // Handle form submission logic here
            console.log("Form submitted:", formState);
            setDialogType(null); // Close dialog after submission
        }
    };

    const totalPrice = formState.selectedProducts.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
            {/* Action Buttons */}
            {isOpen && (
                <div className="flex flex-col gap-2 transition-all">
                    <Button variant="outline" className="flex items-center justify-start" onClick={() => openDialog("buy")}>
                        <ShoppingCart size={20} />
                        Buy
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start" onClick={() => openDialog("sell")}>
                        <DollarSign size={20} />
                        Sell
                    </Button>
                    <Button variant="outline" className="flex items-center justify-start" onClick={() => openDialog("expense")}>
                        <CreditCard size={20} />
                        Expense
                    </Button>
                </div>
            )}

            {/* Main Floating Button */}
            <Button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Plus size={24} />}
            </Button>

            {/* Buy & Sell Dialog */}
            {(dialogType === "buy" || dialogType === "sell") && (
                <Dialog open onOpenChange={() => setDialogType(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{dialogType === "buy" ? "Buy Product" : "Sell Product"}</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            {/* Product Selection - left side, takes more space */}
                            <div className="md:w-2/3 w-full">
                                <ProductSelection
                                    selectedProducts={formState.selectedProducts}
                                    onSelect={handleProductSelect}
                                    onRemove={removeProduct}
                                    onUpdate={updateProduct}
                                />
                                {errors.selectedProducts && (
                                    <p className="text-red-500 text-sm">{errors.selectedProducts}</p>
                                )}
                            </div>

                            {/* Right side - Customer + Date */}
                            <div className="md:w-1/3 w-full flex flex-col gap-4">
                                <EntitySelection
                                    entities={customers}
                                    selectedEntity={formState.selectedCustomer}
                                    onSelect={(id) =>
                                        setFormState((prev) => ({ ...prev, selectedCustomer: id }))
                                    }
                                    placeholder="Select Customer"
                                />

                                <DatePicker
                                    selectedDate={formState.date}
                                    onSelect={(date) => setFormState((prev) => ({ ...prev, date }))}
                                />
                                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                            </div>
                        </div>


                        {/* Total Price */}
                        <p className="text-right text-lg font-bold">Total: {totalPrice} BDT</p>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Expense Dialog */}
            {dialogType === "expense" && (
                <Dialog open onOpenChange={() => setDialogType(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>

                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            {/* Left side - Note (wider) */}
                            <div className="md:w-2/3 w-full flex flex-col gap-4">
                                <Input
                                    placeholder="Expense Name"
                                    value={formState.expenseName}
                                    onChange={(e) =>
                                        setFormState((prev) => ({ ...prev, expenseName: e.target.value }))
                                    }
                                />
                                {errors.expenseName && (
                                    <p className="text-red-500 text-sm">{errors.expenseName}</p>
                                )}
                                
                                <Textarea
                                    placeholder="Expense Note"
                                    value={formState.expenseNote}
                                    onChange={(e) =>
                                        setFormState((prev) => ({ ...prev, expenseNote: e.target.value }))
                                    }
                                />
                            </div>

                            {/* Right side - Name, Amount, Date */}
                            <div className="md:w-1/3 w-full flex flex-col gap-4">


                                <Input
                                    placeholder="Expense Amount"
                                    value={formState.expenseAmount}
                                    onChange={(e) =>
                                        setFormState((prev) => ({ ...prev, expenseAmount: e.target.value }))
                                    }
                                />
                                {errors.expenseAmount && (
                                    <p className="text-red-500 text-sm">{errors.expenseAmount}</p>
                                )}

                                <DatePicker
                                    selectedDate={formState.date}
                                    onSelect={(date) =>
                                        setFormState((prev) => ({ ...prev, date }))
                                    }
                                />
                            </div>
                        </div>


                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default FloatingActions;