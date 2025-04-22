import { useState } from "react";
import { Search, Inbox, ChevronRight, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/useTransaction";
import { useParams } from "react-router-dom";
import { SmartPagination } from "@/components/ui/SmartPagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";


const TransactionPage = () => {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
    });
    const { type } = useParams();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: transactionData, isLoading } = useTransactions({
        page: currentPage,
        limit: 10,
        search,
        dateFrom: dateRange?.from,
        dateTo: dateRange?.to,
        type: type === "all" ? undefined : type,
    });

    const handleFromDateChange = (date: Date | undefined) => {
        if (!date) return;
        const normalizedFromDate = normalizeStartOfDay(date);
        setDateRange(prev => ({
            from: normalizedFromDate,
            to: prev?.to && normalizedFromDate > normalizeStartOfDay(prev.to)
                ? normalizedFromDate
                : prev?.to,
        }));
    };

    const handleToDateChange = (date: Date | undefined) => {
        if (!date) return;
        const normalizedToDate = normalizeEndOfDay(date);
        setDateRange(prev => ({
            from: prev?.from,
            to: normalizedToDate,
        }));
    };

    // Function to normalize to the start of the day (00:00:00)
    const normalizeStartOfDay = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0); // Set to the beginning of the day (00:00:00)
        return normalized;
    };

    // Function to normalize to the end of the day (23:59:59.999)
    const normalizeEndOfDay = (date: Date) => {
        const normalized = new Date(date);
        normalized.setHours(23, 59, 59, 999); // Set to the end of the day (23:59:59.999)
        return normalized;
    };

    // Today's date normalized to the start of the day
    const today = normalizeStartOfDay(new Date());


    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Transactions
            </h1>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search by note or customer..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[150px] justify-start">
                                {dateRange?.from ? (
                                    format(dateRange.from, "MMM dd, yyyy")
                                ) : (
                                    <span>Start date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateRange?.from}
                                onSelect={handleFromDateChange}
                                initialFocus
                                disabled={(date) => {
                                    const normalizedDate = normalizeStartOfDay(date);
                                    const todayNormalized = normalizeStartOfDay(today);
                                    const toDateNormalized = dateRange?.to ? normalizeEndOfDay(dateRange.to) : todayNormalized; // Fallback to today's date if `to` is undefined

                                    // Disable if date is in the future or after the `to` date
                                    return normalizedDate > todayNormalized || normalizedDate > toDateNormalized;
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <ChevronRight className="text-gray-500 w-4 h-4" />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[150px] justify-start">
                                {dateRange?.to ? (
                                    format(dateRange.to, "MMM dd, yyyy")
                                ) : (
                                    <span>End date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dateRange?.to}
                                onSelect={handleToDateChange}
                                initialFocus
                                disabled={(date) => {
                                    const normalizedDate = normalizeEndOfDay(date);
                                    const todayNormalized = normalizeEndOfDay(today);
                                    const fromNormalized = dateRange.from!; // Only normalize `from` if it exists

                                    // Disable if date is in the future or earlier than the `from` date (if defined)
                                    return normalizedDate > todayNormalized || (fromNormalized && normalizedDate < fromNormalized);
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <Card className="bg-white dark:bg-stone-950 text-gray-900 dark:text-gray-100">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment Type</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow key={index}>
                                            {[...Array(6)].map((_, i) => (
                                                <TableCell key={i}>
                                                    <Skeleton className="h-4 w-[100px]" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : transactionData?.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center text-gray-500">
                                                <Inbox className="w-10 h-10 mb-2 text-gray-400" />
                                                <p className="text-base font-medium">No Transactions found</p>
                                                <p className="text-sm text-gray-400">Try different filters or add a transaction.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactionData?.data?.map((txn: Transaction) => (
                                        <TableRow key={txn._id}>
                                            <TableCell className="capitalize">{txn.paymentType || "Unknown"}</TableCell>
                                            <TableCell>{txn.customerName || "—"}</TableCell>
                                            <TableCell>
                                                {txn.products?.length ? (
                                                    <Popover>
                                                        <PopoverTrigger className="cursor-pointer underline">
                                                            {txn.products.length} products
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <div className="space-y-2">
                                                                {txn.products.map(p => (
                                                                    <div key={p.productId.toString()} className="flex border-b justify-between">
                                                                        <span>{p.productId?.name || "Unknown"}</span>
                                                                        <span className="flex items-center gap-1">×{p.quantity} = <IndianRupee size={12}/> {p.price}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : "—"}
                                            </TableCell>
                                            <TableCell>${txn.total.toFixed(2)}</TableCell>
                                            <TableCell className="max-w-[150px] truncate">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-pointer truncate block">{txn.note || "—"}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{txn.note || "No note provided"}</TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell className="capitalize">{txn.type == "due" ? "Due Adjustment" : txn.type == "receivable" ? "Receivable Adjustment" : txn.type || "Unknown"}</TableCell>
                                            <TableCell>
                                                {txn.date ? format(new Date(txn.date), "MMM dd, yyyy") : "—"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Pagination */}
            <SmartPagination
                currentPage={currentPage}
                totalPages={transactionData?.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default TransactionPage;