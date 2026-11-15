export interface OrderCreateModel {
  name: string;
  email: string;
  mobileNumber: string;
  shippingAddress: string;
  shippingZone: number;
  paymentMethod: number;
  couponCode?: string;
}
