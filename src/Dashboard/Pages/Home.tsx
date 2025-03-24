import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Package, TrendingUp, PlusCircle, Wallet, Banknote, CreditCard, Eye, Users, Truck, Star, AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Heading */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Total Sales" amount="৳50,000" icon={<ShoppingCart className="text-blue-600" />} />
        <SummaryCard title="Total Purchases" amount="৳30,000" icon={<Package className="text-green-600" />} />
        <SummaryCard title="Total Expenses" amount="৳5,000" icon={<Wallet className="text-red-600" />} />
        <SummaryCard title="Profit/Loss" amount="৳15,000" icon={<TrendingUp className="text-purple-600" />} />
      </div>

      {/* Balance & Credit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Balance" amount="৳50,000" icon={<Wallet className="text-blue-600" />} />
        <SummaryCard title="Total Debts" url="#" amount="৳30,000" icon={<CreditCard className="text-red-600" />} />
        <SummaryCard title="Total Credits" url="#" amount="৳30,000" icon={<Banknote className="text-green-600" />} />
      </div>

      {/* New Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Sold & Lowest Sold Items */}
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Selling & Lowest Selling Items</h2>
          <div className="space-y-4">
            <ItemCard title="Best Seller: Laptop" amount="৳12,000" icon={<Star className="text-yellow-500" />} />
            <ItemCard title="Lowest Seller: Printer" amount="৳1,200" icon={<AlertCircle className="text-red-500" />} />
            <p className="text-gray-600 dark:text-gray-400">Total Transactions Today: <span className="font-semibold">120</span></p>
          </div>
        </Card>

        {/* Total Customers & Suppliers with Progress Indicator */}
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Customers & Suppliers</h2>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <Users className="w-10 h-10 text-blue-600 mx-auto" />
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-lg font-bold">320</p>
            </div>
            <Progress value={75} className="w-28 h-2 bg-gray-300 rounded-full" />
            <div className="text-center">
              <Truck className="w-10 h-10 text-green-600 mx-auto" />
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-lg font-bold">45</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Transactions</h2>
        <div className="divide-y divide-gray-300 dark:divide-gray-700">
          <TransactionItem title="Product Sale" amount="+৳10,000" type="income" />
          <TransactionItem title="Office Rent" amount="-৳3,000" type="expense" />
          <TransactionItem title="New Purchase" amount="-৳5,000" type="expense" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Sale
        </Button>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Purchase
        </Button>
        <Button className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Expense
        </Button>
      </div>
    </div>
  );
}

// Summary Card Component
function SummaryCard({ title, amount, icon, url }: { title: string; amount: string; icon: React.ReactNode, url?: string }) {
  return (
    <Card className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg p-4 py-7 relative">
      {/* See Details Button */}
      {url && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute w-max px-2 top-3 right-3 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => alert(`Viewing details for ${title}`)} // Replace with actual functionality
        >
          <Eye className="w-5 h-5" />
          See Details
        </Button>
      )}

      <CardContent className="flex items-center gap-4">
        {/* Icon on the Left */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          {icon}
        </div>

        {/* Title & Amount on the Right */}
        <div>
          <CardTitle className="text-lg mb-3">{title}</CardTitle>
          <p className="text-2xl font-bold">{amount}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Transaction Item Component
function TransactionItem({ title, amount, type }: { title: string; amount: string; type: "income" | "expense" }) {
  return (
    <div className="flex justify-between items-center py-3">
      <p className="text-gray-900 dark:text-gray-100 font-medium">{title}</p>
      <Badge
        className={`text-sm px-3 py-1 rounded-md ${
          type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {amount}
      </Badge>
    </div>
  );
}

// Item Card Component
function ItemCard({ title, amount, icon }: { title: string; amount: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-gray-900 dark:text-gray-100 font-medium">{title}</p>
      </div>
      <p className="font-semibold">{amount}</p>
    </div>
  );
}
