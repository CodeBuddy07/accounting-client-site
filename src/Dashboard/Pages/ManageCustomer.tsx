import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { PlusCircle, Edit, Trash2, Search, CreditCard, IndianRupee, Send, SendHorizonal } from "lucide-react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner";




const ManageCustomers = () => {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([
        { id: 1, name: "John Doe", phone: "01700-000000", dues: 3000, note: "Regular customer" },
        { id: 2, name: "Jane Smith", phone: "01800-111111", receivable: 200, note: "Frequent buyer" },
    ]);

    const [newCustomer, setNewCustomer] = useState<Customer>({
        id: 0,
        name: "",
        phone: "",
        note: "",
    });

    const [payment, setPayment] = useState<number | "">("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

    // Add Customer
    const handleAddCustomer = () => {
        if (!newCustomer.name || !newCustomer.phone) {
            toast.error("Required Feilds", { description: "Name and phone number are required!" })
            return;
        }

        setCustomers([...customers, { ...newCustomer, id: Date.now() }]);
        setNewCustomer({ id: 0, name: "", phone: "", note: "" });
        setIsDialogOpen(false);
    };

    // Delete Customer
    const handleDeleteCustomer = (id: number) => {
        if (confirm("Are you sure you want to delete this customer?")) {
            setCustomers(customers.filter((customer) => customer.id !== id));
        }
    };

    // Handle Payments (Debts & Credits)
    const handlePayment = () => {
        if (!selectedCustomer || payment === "") return;

        setCustomers(
            customers.map((customer) =>
                customer.id === selectedCustomer.id
                    ? {
                        ...customer,
                        debts: (customer.dues || 0) - Number(payment),
                        credits: (customer.receivable || 0) - Number(payment),
                    }
                    : customer
            )
        );

        setPayment("");
        setIsPayDialogOpen(false);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Page Heading */}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Manage Customers
            </h1>

            {/* Search & Add Customer */}
            <div className="flex justify-between items-center gap-4">
                <div className="relative w-full mr-5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Add Customer Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5" /> Add Customer
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={newCustomer.name}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, name: e.target.value })
                                    }
                                />
                                <Input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={newCustomer.phone}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, phone: e.target.value })
                                    }
                                />
                            </div>
                            <Textarea
                                placeholder="Note (optional)"
                                value={newCustomer.note}
                                onChange={(e) =>
                                    setNewCustomer({ ...newCustomer, note: e.target.value })
                                }
                            />
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    placeholder="Previous Due"
                                    value={newCustomer.dues}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, dues: Number(e.target.value) })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Previous Receivable"
                                    value={newCustomer.receivable}
                                    onChange={(e) =>
                                        setNewCustomer({ ...newCustomer, receivable: Number(e.target.value) })
                                    }
                                />
                            </div>
                            <Button onClick={handleAddCustomer} className="w-full">
                                Add Customer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Customer Table */}
            <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Dues</TableHead>
                                <TableHead>Receivable</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers
                                .filter(
                                    (customer) =>
                                        customer.name.toLowerCase().includes(search.toLowerCase()) ||
                                        customer.phone.includes(search)
                                )
                                .map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`px-3 flex justify-center items-center gap-2 py-1 rounded-md ${customer.dues ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                <IndianRupee /> {customer.dues || "-"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className={`px-3 py-1 rounded-md ${customer.receivable
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                <IndianRupee /> {customer.receivable || "-"}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="max-w-[150px] truncate">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-pointer truncate block">{customer.note}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{customer.note}</TooltipContent>
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell className=" flex gap-2 justify-end">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setIsPayDialogOpen(true);
                                                }}
                                            >
                                                <CreditCard className="w-5 h-5 text-yellow-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setIsMessageDialogOpen(true);
                                                }}
                                            >
                                                <Send className="w-5 h-5 text-green-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    setSelectedCustomer(customer);
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="w-5 h-5 text-blue-600" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteCustomer(customer.id)}
                                            >
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            {/* Pay Dialog */}
            <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Make a Payment</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center item-center gap-5">
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="credit">Credit</SelectItem>
                                    <SelectItem value="debt">Debt</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={payment}
                            onChange={(e) => setPayment(Number(e.target.value))}
                        />
                    </div>
                    <Button onClick={handlePayment} className="w-full">
                        Pay
                    </Button>
                </DialogContent>
            </Dialog>


            {/* Send Message Dialog */}

            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Message To {selectedCustomer?.name || "Customer"}</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        placeholder="Write a message..."
                    />

                    <Button className="w-full">
                        Send <SendHorizonal size={20} />
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Edit Customer Dialog */}

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Customer</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                type="text"
                                placeholder="Customer Name"
                                value={selectedCustomer?.name}

                            />
                            <Input
                                type="text"
                                placeholder="Phone Number"
                                value={selectedCustomer?.phone}

                            />
                        </div>
                        <Textarea
                            placeholder="Note (optional)"
                            value={selectedCustomer?.note}

                        />
                        
                        <Button onClick={handleAddCustomer} className="w-full">
                            Update Customer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ManageCustomers;
