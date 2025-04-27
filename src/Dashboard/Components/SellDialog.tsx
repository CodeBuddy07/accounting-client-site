import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown, DollarSign, Trash2, PercentIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { useCustomers } from "@/hooks/useCustomer";
import { Textarea } from "@/components/ui/textarea";
import { useAddTransaction } from "@/hooks/useTransaction";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectedProduct extends Product {
    tempPrice: number;
    quantity: number;
}

export function SellDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [sms, setSMS] = useState(false);
    const [note, setNote] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [customerSearch, setCustomerSearch] = useState("");
    const [productSearch, setProductSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [paymentType, setPaymentType] = useState<"cash" | "due">("cash");
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");

    const customerDropdownRef = useRef<HTMLDivElement>(null);
    const productDropdownRef = useRef<HTMLDivElement>(null);

    const { mutate: addTransaction, isPending: transactionPending } = useAddTransaction();

    const { data: customerData, isLoading: customerLoading } = useCustomers({
        page: 1,
        limit: 10,
        search: customerSearch,
    });

    const { data: productData, isLoading: productLoading } = useProducts({
        page: 1,
        limit: 10,
        search: productSearch,
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target as Node)) {
                setShowCustomerDropdown(false);
            }
            if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
                setShowProductDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleProductSelect = (product: Product) => {
        const existingProduct = selectedProducts.find((p) => p._id === product._id);

        if (existingProduct) {
            setSelectedProducts(selectedProducts.map(p =>
                p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
            ));
        } else {
            setSelectedProducts([
                ...selectedProducts,
                {
                    ...product,
                    tempPrice: product.sellingPrice,
                    quantity: 1,
                },
            ]);
        }
        setProductSearch("");
        setShowProductDropdown(false);
    };

    const removeProduct = (productId: string) => {
        setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
    };

    const updateProductPrice = (productId: string, newPrice: number) => {
        setSelectedProducts(
            selectedProducts.map((p) =>
                p._id === productId ? { ...p, tempPrice: newPrice } : p
            )
        );
    };

    const updateProductQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setSelectedProducts(
            selectedProducts.map((p) =>
                p._id === productId ? { ...p, quantity: newQuantity } : p
            )
        );
    };

    const calculateSubtotal = () => {
        return selectedProducts.reduce(
            (total, product) => total + product.tempPrice * product.quantity,
            0
        );
    };

    const calculateDiscountAmount = () => {
        const subtotal = calculateSubtotal();
        if (discountType === "percentage") {
            return (subtotal * discount) / 100;
        } else {
            return discount;
        }
    };

    const generateFullNote = () => {
        const subtotal = calculateSubtotal(); // assuming you already have this function
        const discountAmount = discountType === "percentage" 
          ? (subtotal * discount) / 100 
          : discount;
      
        let discountText = "";
      
        if (discountType === "percentage") {
          discountText = `Discount of ${discount}% (৳${discountAmount.toFixed(2)}) on total ৳${subtotal.toFixed(2)} applied.`;
        } else {
          discountText = `Discount of ৳${discountAmount.toFixed(2)} on total ৳${subtotal.toFixed(2)} applied.`;
        }
      
        if (note.trim()) {
          return `${note} | ${discountText}`;
        } else {
          return discountText;
        }
      };
      
      

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discountAmount = calculateDiscountAmount();
        return subtotal - discountAmount;
    };

    const handleSubmit = () => {
        if (!selectedCustomer) {
            alert("Please select a customer");
            return;
        }

        if (selectedProducts.length === 0) {
            alert("Please select at least one product");
            return;
        }

        const saleData = {
            type: "sell",
            customerId: selectedCustomer._id,
            customerName: selectedCustomer.name,
            products: selectedProducts.map((p) => ({
                productId: p._id,
                price: p.tempPrice,
                quantity: p.quantity,
            })),
            date,
            paymentType,
            note: generateFullNote(),
            sms,
            discount: {
                type: discountType,
                value: discount,
                amount: calculateDiscountAmount(),
            },
            subtotal: calculateSubtotal(),
            total: calculateTotal(),
        };

        addTransaction(
            {
                ...saleData
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setNote("");
                    setSelectedCustomer(null);
                    setSelectedProducts([]);
                    setDate(new Date());
                    setPaymentType("cash");
                    setDiscount(0);
                    setDiscountType("percentage");
                }
            }
        );  
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="mb-4">Create New Sell</DialogTitle>
                </DialogHeader>


                {/* Customer Selection */}
                <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
                    <div className="flex-1 w-full">
                        <div className=" space-y-2">
                            <Label htmlFor="customer" className="text-right">
                                Customer
                            </Label>
                            <div className="col-span-3 relative" ref={customerDropdownRef}>
                                <div className="relative">
                                    <Input
                                        placeholder="Search customer..."
                                        defaultValue={selectedCustomer ? selectedCustomer.name : customerSearch}
                                        onChange={(e) => {
                                            setCustomerSearch(e.target.value);
                                            if (!showCustomerDropdown) setShowCustomerDropdown(true);
                                        }}
                                        onFocus={() => setShowCustomerDropdown(true)}
                                        className="w-full"
                                    />
                                    <ChevronsUpDown
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
                                        onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                                    />
                                </div>

                                {showCustomerDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-stone-950 shadow-lg rounded-md border border-gray-200 dark:border-stone-700 max-h-60 overflow-auto">
                                        {customerLoading ? (
                                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                                        ) : customerData?.data?.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No customers found</div>
                                        ) : (
                                            <ul>
                                                {customerData?.data?.map((customer: Customer) => (
                                                    <li
                                                        key={customer._id}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-stone-900 border-b font-semibold cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setShowCustomerDropdown(false);
                                                        }}
                                                    >
                                                        {customer.name} (<span className="text-sm font-normal">{customer.phone}</span>)
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Selection */}
                        <div className="space-y-2 my-2">
                            <Label htmlFor="products" className="text-right">
                                Products
                            </Label>
                            <div className="col-span-3 relative" ref={productDropdownRef}>
                                <div className="relative">
                                    <Input
                                        placeholder="Search products..."
                                        value={productSearch}
                                        onChange={(e) => {
                                            setProductSearch(e.target.value);
                                            if (!showProductDropdown) setShowProductDropdown(true);
                                        }}
                                        onFocus={() => setShowProductDropdown(true)}
                                        className="w-full"
                                    />
                                    <ChevronsUpDown
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
                                        onClick={() => setShowProductDropdown(!showProductDropdown)}
                                    />
                                </div>

                                {showProductDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-stone-950 shadow-lg rounded-md border border-gray-200 dark:border-stone-700 max-h-60 overflow-auto">
                                        {productLoading ? (
                                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                                        ) : productData?.data?.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No products found</div>
                                        ) : (
                                            <ul>
                                                {productData?.data?.map((product: Product) => (
                                                    <li
                                                        key={product._id}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-stone-900 border-b font-semibold flex items-center cursor-pointer"
                                                        onClick={() => handleProductSelect(product)}
                                                    >
                                                        {product.name} (<span className="text-sm flex items-center font-normal justify-center"><DollarSign size={12}/> {product.sellingPrice}</span>)
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Products List */}
                        {selectedProducts.length > 0 && (
                            <div className="space-y-2 mt-2">
                                <div className=" space-y-2">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Input
                                                        type="number"
                                                        value={product.tempPrice}
                                                        onChange={(e) =>
                                                            updateProductPrice(product._id, parseFloat(e.target.value))
                                                        }
                                                        className="w-24 h-8"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) =>
                                                            updateProductQuantity(product._id, parseInt(e.target.value))
                                                        }
                                                        className="w-16 h-8"
                                                        min="1"
                                                    />
                                                    =
                                                    <span className="flex items-center justify-center">
                                                         <DollarSign size={13}/> {(product.tempPrice * product.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeProduct(product._id)}
                                            >
                                                <Trash2 className="h-4 w-4 mt-6 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full">
                        {/* Date Picker */}
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3 relative">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        readOnly
                                        value={date ? format(date, "PPP") : ""}
                                        placeholder="Select date"
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        className="w-full cursor-pointer"
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

                        {/* Discount Section */}
                        <div className="space-y-2 mt-2">
                            <Label htmlFor="discount" className="text-right">
                                Discount
                            </Label>
                            <div className="flex gap-2 items-center">
                                <Select
                                    value={discountType}
                                    onValueChange={(value: "percentage" | "fixed") => setDiscountType(value)}
                                >
                                    <SelectTrigger className="w-36">
                                        <SelectValue placeholder="Discount type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="relative flex-1">
                                    <Input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                        placeholder={discountType === "percentage" ? "Discount %" : "Discount amount"}
                                        className="w-full"
                                        min="0"
                                    />
                                    {discountType === "percentage" && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <PercentIcon className="h-4 w-4 opacity-50" />
                                        </div>
                                    )}
                                    {discountType === "fixed" && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <DollarSign className="h-4 w-4 opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Note - Updated with discount hint */}
                        <div className="space-y-2 mt-2">
                            <Label htmlFor="note" className="text-right">
                                Note
                            </Label>
                            <div className="col-span-3">
                                <Textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={discount > 0 ? 
                                        `Additional notes about this sell (e.g., reason for ${discountType === "percentage" ? `${discount}% discount` : `$${discount} discount`})...` : 
                                        "Additional notes about this sell..."
                                    }
                                    className="min-h-[100px] w-full"
                                />
                            </div>
                        </div>

                        {/* Payment Type */}
                        <div className="space-y-2 mt-2">
                            <Label htmlFor="paymentType" className="text-right">
                                Payment Type
                            </Label>
                            <div className="col-span-3">
                                <Select
                                    value={paymentType}
                                    onValueChange={(value: "cash" | "due") => setPaymentType(value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select payment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="due">Due</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Automate SMS Sending */}
                        <div className="flex items-center space-x-2 mt-4">
                            <Checkbox defaultChecked={sms} onCheckedChange={(value) => setSMS(value === true)} id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                               Send Automate Message.
                            </label>
                        </div>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="grid grid-cols-4 items-center gap-4 mt-2">
                    <Label className="text-right">Subtotal : </Label>
                    <div className="col-span-3 font-medium flex items-center gap-1">
                        <DollarSign size={15} />{calculateSubtotal().toFixed(2)}
                    </div>

                    {discount > 0 && (
                        <>
                            <Label className="text-right">Discount : </Label>
                            <div className="col-span-3 text-red-500 font-medium flex items-center gap-1">
                                - <DollarSign size={15} />{calculateDiscountAmount().toFixed(2)}
                                {discountType === "percentage" && (
                                    <span className="ml-1 text-gray-500">({discount}%)</span>
                                )}
                            </div>
                        </>
                    )}

                    <Label className="text-right text-lg font-bold">Total : </Label>
                    <div className="col-span-3 text-lg font-semibold flex items-center gap-1">
                        <DollarSign size={17} />{calculateTotal().toFixed(2)}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button disabled={transactionPending} variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{ transactionPending? "Creating...": "Create Sell"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}