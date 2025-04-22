
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  AlertCircle, 
  ShoppingCart, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';
import { useDashboard } from '@/hooks/useStatistics';

const Dashboard = () => {
  

  const { data, isLoading: loading } = useDashboard();

  const stats = data?.data;

  // Color palette for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalSales)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalSales > stats.totalPurchases ? (
                    <span className="text-green-500 flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      Profit: {formatCurrency(stats.totalSales - stats.totalPurchases)}
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      Loss: {formatCurrency(stats.totalPurchases - stats.totalSales)}
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Total Purchases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalPurchases)}</div>
                <p className="text-xs text-muted-foreground">Inventory Value: {formatCurrency(stats.inventoryValue)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Net Cash Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(stats.netCashFlow)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due: {formatCurrency(stats.totalDue)} | Receivable: {formatCurrency(stats.totalReceivable)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Profit Margin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.profitMargin?.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.profitMargin > 20 ? (
                    <span className="text-green-500">Healthy margin</span>
                  ) : (
                    <span className="text-amber-500">Needs improvement</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.customerCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.productCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Last 6 months sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#0088FE" 
                      name="Sales" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
                <CardDescription>Sales vs Purchases vs Expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sales', value: stats.totalSales },
                        { name: 'Purchases', value: stats.totalPurchases },
                        { name: 'Expenses', value: stats.totalExpenses }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Sales', value: stats.totalSales },
                        { name: 'Purchases', value: stats.totalPurchases },
                        { name: 'Expenses', value: stats.totalExpenses }
                      ].map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Tabs defaultValue="top-products">
              <TabsList className="mb-2">
                <TabsTrigger value="top-products">Top Products</TabsTrigger>
                <TabsTrigger value="top-customers">Top Customers</TabsTrigger>
              </TabsList>
              <Card>
                <TabsContent value="top-products">
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Products with highest sales volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.topSellingProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalQuantity" name="Quantity Sold" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="totalSales" name="Revenue" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </TabsContent>
                <TabsContent value="top-customers">
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Customers with highest spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.topCustomers}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="totalSpent" name="Total Spent" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </TabsContent>
              </Card>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Last 5 transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentTransactions.map((transaction:Transaction) => (
                    <div key={transaction._id} className="flex items-center space-x-4 p-2 rounded border">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'sell' ? 'bg-green-100' : 
                        transaction.type === 'buy' ? 'bg-blue-100' : 
                        transaction.type === 'expense' ? 'bg-red-100' : 'bg-amber-100'
                      }`}>
                        {transaction.type === 'sell' ? <TrendingUp className="h-4 w-4 text-green-500" /> : 
                          transaction.type === 'buy' ? <ShoppingCart className="h-4 w-4 text-blue-500" /> : 
                          transaction.type === 'expense' ? <AlertCircle className="h-4 w-4 text-red-500" /> : 
                          <CreditCard className="h-4 w-4 text-amber-500" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className="font-medium capitalize">
                          {transaction.type} 
                          {transaction.customerId && ` - ${transaction.customerId.name}`}
                          {transaction.customerName && !transaction.customerId && ` - ${transaction.customerName}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'} - {transaction.paymentType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'sell' || transaction.type === 'receivable' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.type === 'sell' || transaction.type === 'receivable' ? '+' : '-'}
                          {formatCurrency(transaction.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;