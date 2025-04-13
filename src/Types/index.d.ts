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
}

