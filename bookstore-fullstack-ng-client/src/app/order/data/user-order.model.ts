import { BookCartModel } from "../../cart/data/cart-read.model";

export interface UserOrderModel {
  id: number;
  email: string;
  name: string;
  mobileNumber: string;
  orderDate: string;
  orderStatus: number;
  subTotal: number;
  tax: number;
  total: number;
  payment: null;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  quantity: number;
  price: number;
  book: BookCartModel;
}
