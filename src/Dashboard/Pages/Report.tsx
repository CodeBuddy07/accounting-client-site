/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { format } from "date-fns"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useCustomerReport, useCustomers } from "@/hooks/useCustomer"
import { Label } from "@/components/ui/label"
import { ChevronsUpDown, IndianRupee } from "lucide-react"
import { SmartPagination } from "@/components/ui/SmartPagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"





export function CustomerReportPage() {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)


    // Fetch customers for selection
    const { data: customerData, isLoading: loadingCustomers } = useCustomers({
        page: 1,
        limit: 5,
        search
    })

    // Fetch report for selected customer
    const {
        data: report,
        isLoading: loadingReport,
        isError,
        error,
        isFetching
    } = useCustomerReport({ id: selectedCustomerId!, page: currentPage, limit: 10 });



    const selectedCustomer = customerData?.data?.find(
        (customer: Customer) => customer._id === selectedCustomerId
    )

    if (loadingCustomers) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-64" />
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {selectedCustomer
                    ? `Customer Report: ${selectedCustomer.name}`
                    : "Select a customer"}
            </h1>
            <div className="flex justify-between items-center">


                {/* Customer Selection */}
                <div className="space-y-2 min-w-80">
                    <Label htmlFor="customer" className="text-right">
                        Select Customer
                    </Label>
                    <div className=" relative">
                        <div className="relative">
                            <Input
                                placeholder="Search customer..."
                                value={selectedCustomer ? selectedCustomer.name : search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1); // Reset to first page on new search
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full"
                            />
                            <ChevronsUpDown
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                        </div>

                        {showDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-stone-950 shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                                {loadingCustomers ? (
                                    <div className="p-2 text-sm text-gray-500">Loading...</div>
                                ) : customerData?.data?.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">No customers found</div>
                                ) : (
                                    <>
                                        <ul>
                                            {customerData?.data?.map((customer: Customer) => (
                                                <li
                                                    key={customer._id}
                                                    className={`p-2 hover:bg-gray-100 dark:hover:bg-stone-900 cursor-pointer ${selectedCustomerId === customer._id ? "bg-blue-50 dark:bg-stone-800" : ""
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedCustomerId(customer._id);
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-sm text-gray-500">{customer.phone}</div>
                                                </li>
                                            ))}
                                        </ul>

                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    variant="outline"
                    disabled={!selectedCustomerId}
                    className="ml-2"
                >
                    Export
                </Button>


            </div>



            {loadingReport && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-64" />
                </div>
            )}

            {isFetching && (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                    <Skeleton className="h-64" />
                </div>
            )}

            {isError && (
                <div className="text-red-500">
                    Error loading report: {(error as any)?.response?.data?.message || error?.message}
                </div>
            )}

            {report && !isFetching && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl flex justify-start items-center gap-2 font-bold">
                                    <IndianRupee /> {report.totals.totalPurchases.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl flex justify-start items-center gap-2 font-bold">
                                    <IndianRupee /> {report.totals.totalSales.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Amount Owed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl flex justify-start items-center gap-2 font-bold text-green-600">
                                    <IndianRupee /> {report.totals.amountOwed.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl flex justify-start items-center gap-2 font-bold text-red-600">
                                    <IndianRupee /> {report.totals.amountDue.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Balance Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl flex gap-2 justify-start items-center font-bold ${report.customerInfo.balance > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <IndianRupee /> {Math.abs(report.customerInfo.balance).toFixed(2)}{' '}
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({report.customerInfo.balance > 0 ? 'Customer owes us' : 'We owe customer'})
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transactions Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Products</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.transactions.data.map((txn) => (
                                            <TableRow key={txn.id}>
                                                <TableCell>{format(new Date(txn.date), 'MMM dd, yyyy')}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={
                                                            txn.type === 'buy'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : txn.type === 'sell'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                        }
                                                    >
                                                        {txn.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {txn.products?.length ? (
                                                        <Popover>
                                                            <PopoverTrigger className="cursor-pointer underline">
                                                                {txn.products.length} products
                                                            </PopoverTrigger>
                                                            <PopoverContent>
                                                                <div className="space-y-2">
                                                                    {txn.products.map((p, idx) => (
                                                                        <div key={idx} className="flex border-b justify-between">
                                                                            <span>{p.name || "Unknown"}</span>
                                                                            <span className="flex items-center gap-1">×{p.quantity} = <IndianRupee size={12} /> {p.price}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    ) : "—"}
                                                </TableCell>
                                                <TableCell className="flex justify-start items-center gap-2"> <IndianRupee size={16} /> {txn.amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge className={txn.paymentType === 'due' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                                                        {txn.paymentType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-[200px] truncate">
                                                    {txn.note || '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                            <SmartPagination
                                currentPage={currentPage}
                                totalPages={report?.transactions?.pagination?.totalPages}
                                onPageChange={(page) => setCurrentPage(page)}
                            />
                        </CardContent>
                    </Card>

                    
                </>
            )}
        </div>
    )
}