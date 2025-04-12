import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown, IndianRupee, X } from "lucide-react";
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

interface SelectedProduct extends Product {
    tempPrice: number;
    quantity: number;
}

export function SellDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
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

    const customerDropdownRef = useRef<HTMLDivElement>(null);
    const productDropdownRef = useRef<HTMLDivElement>(null);

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

    const calculateTotal = () => {
        return selectedProducts.reduce(
            (total, product) => total + product.tempPrice * product.quantity,
            0
        );
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
            customerId: selectedCustomer._id,
            products: selectedProducts.map((p) => ({
                productId: p._id,
                price: p.tempPrice,
                quantity: p.quantity,
            })),
            date,
            paymentType,
            note,
            total: calculateTotal(),
        };

        console.log("Submitting sale:", saleData);
        setOpen(false);
        setNote(""); // Add this with your other state resets
        setSelectedCustomer(null);
        setSelectedProducts([]);
        setDate(new Date());
        setPaymentType("cash");
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
                    <div className="flex-1">
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
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                        {customerLoading ? (
                                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                                        ) : customerData?.data?.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No customers found</div>
                                        ) : (
                                            <ul>
                                                {customerData?.data?.map((customer: Customer) => (
                                                    <li
                                                        key={customer._id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedCustomer(customer);
                                                            setShowCustomerDropdown(false);
                                                        }}
                                                    >
                                                        {customer.name} ({customer.phone})
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
                                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                        {productLoading ? (
                                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                                        ) : productData?.data?.length === 0 ? (
                                            <div className="p-2 text-sm text-gray-500">No products found</div>
                                        ) : (
                                            <ul>
                                                {productData?.data?.map((product: Product) => (
                                                    <li
                                                        key={product._id}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleProductSelect(product)}
                                                    >
                                                        {product.name} - ${product.sellingPrice}
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

                                <div className="col-span-3 space-y-2">
                                    {selectedProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className="flex items-center justify-between p-2 border rounded"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                <div className="flex gap-2 mt-1">
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
                                                    <span className="flex items-center">
                                                        = ${(product.tempPrice * product.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeProduct(product._id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
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
                                    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
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

                        {/* Note */}
                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-right mt-2">
                                Note
                            </Label>
                            <div className="col-span-3">
                                <Textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Additional notes about this sell..."
                                    className="min-h-[100px]"
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
                    </div>
                </div>

                {/* Total */}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-lg">Total : </Label>
                    <div className="col-span-3 text-lg font-semibold flex items-center gap-1">
                        <IndianRupee size={17} />{calculateTotal().toFixed(2)}
                    </div>
                </div>


                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Create Sale</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}