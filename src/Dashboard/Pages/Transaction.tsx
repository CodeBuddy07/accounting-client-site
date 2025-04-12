import { useState } from "react";
import { Search, Inbox, CalendarIcon } from "lucide-react";
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

const TransactionPage = () => {
    const [search, setSearch] = useState("");
    const [date, setDate] = useState(new Date());
    const { type } = useParams(); // YYYY-MM-DD
    const [currentPage, setCurrentPage] = useState(1);

    const { data: transactionData, isLoading } = useTransactions({
        page: currentPage,
        limit: 10,
        search,
        date: date,
        type: type === "all" ? undefined : type,
    });

    console.log(transactionData, "Transaction Data");
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Transactions
            </h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-max justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? date.toDateString() : "Pick a date"}
                           
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date || undefined} onSelect={(date) => setDate(date!)} />
                    </PopoverContent>
                </Popover>


            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : transactionData?.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
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
                                            <TableCell className="capitalize">{txn.type}</TableCell>
                                            <TableCell>{txn.customer?.name || "—"}</TableCell>
                                            <TableCell>{txn.productId?.name || "—"}</TableCell>
                                            <TableCell>{txn.amount}</TableCell>
                                            <TableCell className="max-w-[150px] truncate">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-pointer truncate block">{txn.note || "—"}</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{txn.note || "No note provided"}</TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{new Date(txn.date!).toLocaleDateString()}</TableCell>
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
