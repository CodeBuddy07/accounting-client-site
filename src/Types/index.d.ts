// Customer Type
interface Customer {
    id: number;
    name: string;
    phone: string;
    dues?: number;
    receivable?: number;
    note?: string;
}

interface Product {
  id: number;
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


