// Customer Type
interface Customer {
  _id: string;
  name: string;
  phone: string;
  balance?: number;
  note?: string;
}

interface Product {
  _id: string;
  name: string;
  buyingPrice: number;
  sellingPrice: number;
  note: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface PasswordResetRequest {
  resetToken: string;
  newPassword: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface Response {
  message: string;
}


interface UpdateCustomerPayload {
  id: string;
  data: Partial<Customer>;
}

interface CustomerPayload {
  name: string;
  phone: string;
  note?: string;
  balance?: number;
}

interface ProductItem {
  productId: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name: string; /* other product fields */ };
  price: number;
  quantity: number;
}

interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface Transaction {
  _id?: string;
  type: string;
  customer?: Customer;
  customerName?: string;
  customerId?: mongoose.Types.ObjectId;
  products?: IProductItem[];
  total: number;
  date?: Date;
  note?: string;
  paymentType?: 'cash' | 'due';
  sms?: boolean
}

interface CustomerReport {
  customerInfo: {
    name: string;
    contact: string;
    balance: number;
  };
  totals: {
    totalPurchases: number;
    totalSales: number;
    amountOwed: number;
    amountDue: number;
  };
  transactions: {
    data: Array<{
      id: string;
      type: 'buy' | 'sell' | 'receivable' | 'due' | 'expense';
      date: string;
      amount: number;
      paymentType: 'cash' | 'due';
      products: Array<{
        name: string;
        price: number;
        quantity: number;
      }>;
      note?: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalTransactions: number;
      transactionsPerPage: number;
    };
  };
}

interface CustomerReportQueryParams {
  page?: number;
  limit?: number;
  id?: string;
}

interface ITemplate {
  _id?: string;
  name: string;
  content: string;
}


interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  totalDue: number;
  totalReceivable: number;
  netCashFlow: number;
  customerCount: number;
  productCount: number;
  topSellingProducts: TopProduct[];
  topCustomers: TopCustomer[];
  monthlyTrend: MonthlyTrend[];
  inventoryValue: number;
  profitMargin: number;
  recentTransactions: Transaction[];
}

interface TopProduct {
  _id: string;
  name: string;
  totalQuantity: number;
  totalSales: number;
}

interface TopCustomer {
  _id: string;
  name: string;
  totalSpent: number;
  count: number;
}

interface MonthlyTrend {
  month: string;
  total: number;
}




