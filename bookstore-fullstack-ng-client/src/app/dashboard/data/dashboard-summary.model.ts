export interface TopSellingBook {
  bookId: number;
  title: string;
  imageUrl: string | null;
  quantitySold: number;
  revenue: number;
}

export interface RevenueByPeriod {
  period: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface DashboardSummary {
  totalRevenue: number;
  revenueThisMonth: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalBooksSold: number;
  topSellingBooks: TopSellingBook[];
  revenueByPeriod: RevenueByPeriod[];
}
