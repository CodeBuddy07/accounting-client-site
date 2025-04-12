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
import { PlusCircle, Edit, Trash2, Search, CreditCard, IndianRupee, Send, SendHorizonal, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAddCustomer, useCustomers, useDeleteCustomer, useEditCustomer } from "@/hooks/useCustomer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddTransaction } from "@/hooks/useTransaction";
import { SmartPagination } from "@/components/ui/SmartPagination";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";





const ManageCustomers = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { data: customerData, isLoading } = useCustomers({ page: currentPage, limit: 10, search });
    const [newCustomer, setNewCustomer] = useState<CustomerPayload>({
        name: "",
        phone: "",
        note: "",
        dues: 0,
        receivable: 0,
    });

    const [payment, setPayment] = useState<Transaction>({
        type: "",
        amount: 0,
    });
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);

    const [editingCustomer, setEditingCustomer] = useState<CustomerPayload>({
        name: "",
        phone: "",
        note: "",
    });

    // Add Customer
    const { mutate: addCustomer, isPending } = useAddCustomer();
    const { mutate: deleteCustomer } = useDeleteCustomer();
    const { mutate: editCustomer, isPending: editLoading } = useEditCustomer();
    const { mutate: addTransaction, isPending: transactionPending } = useAddTransaction();

    const handleAddCustomer = () => {
        if (!newCustomer.name || !newCustomer.phone) {
            toast.error("Required Feilds", { description: "Name and phone number are required!" })
            return;
        }

        addCustomer(newCustomer);
        setNewCustomer({ name: "", phone: "", note: "", dues: 0, receivable: 0 });
        setIsDialogOpen(false);
    };

    const handleEditCustomer = (id: string) => {
        if (!editingCustomer.name || !editingCustomer.phone) {
            toast.error("Required Feilds", { description: "Name and phone number are required!" })
            return;
        }

        editCustomer({ id, updates: editingCustomer });
        setIsEditDialogOpen(false);
    };

    // Delete Customer
    const handleDeleteCustomer = (id: string) => {
        deleteCustomer(id);
        setSelectedCustomer(null);
    };


    const handlePayment = () => {
        if (!selectedCustomer) {
            toast.error("No customer selected.");
            return;
        }

        const amount = Number(payment.amount);
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid payment amount.");
            return;
        }


        if (!payment.type) {
            toast.info("This customer has no outstanding dues or receivables.");
            return;
        }

        addTransaction(
            {
                type: payment.type,
                customerId: selectedCustomer._id,
                amount,
                note: `Manual ${payment.type} of ৳${amount}`,
            },
            {
                onSuccess: () => {
                    setPayment({
                        type: "",
                        amount: 0,
                    });
                    setIsPayDialogOpen(false);
                    setSelectedCustomer(null);
                }
            }
        );
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
                                <div className="flex w-full flex-col">
                                    <label className="text-sm mb-1">Previous Due</label>
                                    <Input
                                        type="number"
                                        value={newCustomer.dues || ''}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, dues: Number(e.target.value) || 0 })
                                        }
                                    />
                                </div>

                                <div className="flex w-full flex-col">
                                    <label className="text-sm mb-1">Previous Receivable</label>
                                    <Input
                                        type="number"
                                        value={newCustomer.receivable || ''}
                                        onChange={(e) =>
                                            setNewCustomer({ ...newCustomer, receivable: Number(e.target.value) || 0 })
                                        }
                                    />
                                </div>
                            </div>

                            <Button disabled={isPending} onClick={handleAddCustomer} className="w-full">
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    "Add Customer"
                                )}
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
                            {isLoading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-[60px] rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-[60px] rounded-md" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                        <TableCell className="flex gap-2 justify-end">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : customerData?.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Inbox className="w-10 h-10 mb-2 text-gray-400" />
                                            <p className="text-base font-medium">No customers found</p>
                                            <p className="text-sm text-gray-400">Start by adding a new customer to see them listed here.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customerData?.data.map((customer: Customer) => (
                                    <TableRow key={customer._id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`px-3 flex justify-center items-center gap-2 py-1 rounded-md ${customer.dues ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
                                            >
                                                <IndianRupee /> {customer.dues || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`px-3 py-1 rounded-md ${customer.receivable ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                                            >
                                                <IndianRupee /> {customer.receivable || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="cursor-pointer truncate block">{customer.note || "—"}</span>
                                                </TooltipTrigger>
                                                <TooltipContent>{customer.note}</TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell className="flex gap-2 justify-end">
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
                                                    setEditingCustomer({
                                                        name: customer.name,
                                                        phone: customer.phone,
                                                        note: customer.note,
                                                    });
                                                    setIsEditDialogOpen(true);
                                                }}
                                            >
                                                <Edit className="w-5 h-5 text-blue-600" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => setSelectedCustomer(customer)}
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure you want to delete this customer?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action is permanent and cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setSelectedCustomer(null)}>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                if (selectedCustomer!._id) handleDeleteCustomer(selectedCustomer!._id);
                                                            }}
                                                        >
                                                            Yes, delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                        </TableCell>
                                    </TableRow>
                                ))
                            )}

                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <SmartPagination
                currentPage={currentPage}
                totalPages={customerData?.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Pay Dialog */}
            <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Make a Payment</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center item-center gap-5">
                        <Select
                            value={payment.type}
                            onValueChange={(value) => {
                                setPayment({ ...payment, type: value });
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Payment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="due">Payment</SelectItem>
                                    <SelectItem value="receivable">Receive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Input
                            type="number"
                            placeholder="Enter amount"
                            defaultValue={payment.amount}
                            onChange={(e) => setPayment({ ...payment, amount: Number(e.target.value) })}
                        />
                    </div>
                    <Button
                        disabled={transactionPending}
                        onClick={handlePayment}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        {transactionPending ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Pay"
                        )}
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
                                defaultValue={selectedCustomer?.name}
                                onChange={(e) =>
                                    setEditingCustomer({ ...editingCustomer, name: e.target.value })
                                }
                            />
                            <Input
                                type="text"
                                placeholder="Phone Number"
                                defaultValue={selectedCustomer?.phone}
                                onChange={(e) =>
                                    setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                                }
                            />
                        </div>
                        <Textarea
                            placeholder="Note (optional)"
                            defaultValue={selectedCustomer?.note}
                            onChange={(e) =>
                                setEditingCustomer({ ...editingCustomer, note: e.target.value })
                            }
                        />

                        <Button onClick={() => handleEditCustomer(selectedCustomer!._id)} className="w-full">

                            {editLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Customer"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ManageCustomers;
