export interface Auth {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNum: string;
  status: string;
  createDate: string;
  updateDate: string;
  userRole: string;
  orders: Order[];
}

export interface Order {
  selected?: boolean;
  id: number;
  product: Product;
  quantity: number;
  totalPrice: number;
  createdDate: string;
  updatedDate: string;
  createdAt?: string;
}
export interface Product {
  id: number;
  productTitle: string;
  productName: string;
  productCategory: string;
  brand: string;
  quantity: number;
  createDate: string;
  updateDate: string;
  price: number;
  imageUrl: string;
}
