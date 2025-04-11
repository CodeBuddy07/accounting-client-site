// Customer Type
interface Customer {
  _id: string;
  name: string;
  phone: string;
  dues?: number;
  receivable?: number;
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
  dues?: number;
  receivable?: number;
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
  customerId?: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  amount: number;
  date?: Date;
  note?: string;
}

