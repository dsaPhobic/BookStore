/** Payload pushed by the API's NotificationHub when an order changes status. */
export interface OrderStatusChangedNotification {
  orderId: number;
  previousStatus: number;
  orderStatus: number;
  previousStatusLabel: string;
  orderStatusLabel: string;
  updatedAt: string;
  message: string;
}

/** A notification kept in the header feed for the current session. */
export interface OrderNotification extends OrderStatusChangedNotification {
  id: string;
  receivedAt: Date;
  read: boolean;
}
