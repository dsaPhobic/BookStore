export interface CouponModel {
  id: number;
  code: string;
  discountPercent: number;
  maxDiscount: number | null;
  isActive: boolean;
  expiryDate: string | null;
  maxUsageCount: number | null;
  usageCount: number;
}

export interface CouponCreateModel {
  code: string;
  discountPercent: number;
  maxDiscount: number | null;
  isActive: boolean;
  expiryDate: string | null;
  maxUsageCount: number | null;
}
