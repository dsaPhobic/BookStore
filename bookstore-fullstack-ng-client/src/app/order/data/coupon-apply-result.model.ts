export interface CouponApplyResultModel {
  code: string;
  discountPercent: number;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  message: string;
}
