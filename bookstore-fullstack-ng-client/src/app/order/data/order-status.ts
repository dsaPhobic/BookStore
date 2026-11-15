export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
}

export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
}

export const ORDER_STATUS_OPTIONS: OrderStatusOption[] = [
  { value: OrderStatus.Pending, label: "Pending" },
  { value: OrderStatus.Processing, label: "Processing" },
  { value: OrderStatus.Shipped, label: "Shipped" },
  { value: OrderStatus.Delivered, label: "Delivered" },
  { value: OrderStatus.Cancelled, label: "Cancelled" },
];

/**
 * Mirrors OrderStatusWorkflow on the API. Forward jumps are allowed,
 * moving backwards is not. Delivered and Cancelled are terminal.
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.Pending]: [
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ],
  [OrderStatus.Processing]: [
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ],
  [OrderStatus.Shipped]: [OrderStatus.Delivered, OrderStatus.Cancelled],
  [OrderStatus.Delivered]: [],
  [OrderStatus.Cancelled]: [],
};

export function getOrderStatusLabel(status: number): string {
  return (
    ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "Unknown"
  );
}

export function getAllowedNextOrderStatuses(status: number): OrderStatus[] {
  return ALLOWED_TRANSITIONS[status as OrderStatus] ?? [];
}

export function isOrderStatusTransitionAllowed(
  current: number,
  next: number
): boolean {
  return getAllowedNextOrderStatuses(current).includes(next as OrderStatus);
}

export function isTerminalOrderStatus(status: number): boolean {
  return (
    status === OrderStatus.Delivered || status === OrderStatus.Cancelled
  );
}

export function getOrderStatusCssClass(status: number): string {
  switch (status) {
    case OrderStatus.Pending:
      return "status-pending";
    case OrderStatus.Processing:
      return "status-processing";
    case OrderStatus.Shipped:
      return "status-shipped";
    case OrderStatus.Delivered:
      return "status-delivered";
    case OrderStatus.Cancelled:
      return "status-cancelled";
    default:
      return "status-unknown";
  }
}
