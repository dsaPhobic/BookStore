import { Injectable, NgZone, computed, inject, signal } from "@angular/core";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";
import {
  OrderNotification,
  OrderStatusChangedNotification,
} from "./order-status-changed.model";

const HUB_URL = `${environment.baseUrl}/hubs/notifications`;
const ORDER_STATUS_CHANGED_EVENT = "OrderStatusChanged";
const MAX_NOTIFICATIONS = 25;

/**
 * Keeps a SignalR connection open for the signed-in customer and collects
 * order status updates pushed by the API.
 */
@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly zone = inject(NgZone);

  private connection: HubConnection | null = null;
  private activeToken: string | null = null;
  private pendingConnect: Promise<void> | null = null;
  private notificationSequence = 0;

  private readonly items = signal<OrderNotification[]>([]);
  private readonly orderStatusChanged = new Subject<OrderNotification>();

  readonly notifications = this.items.asReadonly();
  readonly unreadCount = computed(
    () => this.items().filter((notification) => !notification.read).length
  );

  /** Emits every update as it arrives, for toasts and list refreshes. */
  readonly orderStatusChanged$: Observable<OrderNotification> =
    this.orderStatusChanged.asObservable();

  async connect(accessToken: string): Promise<void> {
    if (
      this.connection &&
      this.activeToken === accessToken &&
      this.connection.state !== HubConnectionState.Disconnected
    ) {
      return;
    }

    if (this.pendingConnect) {
      await this.pendingConnect;
      return;
    }

    this.pendingConnect = this.startConnection(accessToken);
    try {
      await this.pendingConnect;
    } finally {
      this.pendingConnect = null;
    }
  }

  private async startConnection(accessToken: string): Promise<void> {
    await this.disconnect();

    this.activeToken = accessToken;
    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => this.activeToken ?? accessToken,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on(
      ORDER_STATUS_CHANGED_EVENT,
      (payload: OrderStatusChangedNotification) =>
        this.zone.run(() => this.receive(payload))
    );

    this.connection = connection;

    try {
      await connection.start();
      if (this.activeToken !== accessToken) {
        // The customer signed out while the connection was starting.
        await connection.stop();
      }
    } catch (error) {
      // The customer can still use the app; notifications resume on the next
      // successful connection attempt.
      console.error("Could not connect to the notification service", error);
    }
  }

  async disconnect(): Promise<void> {
    this.activeToken = null;
    this.items.set([]);

    const connection = this.connection;
    this.connection = null;
    if (connection) {
      await connection.stop();
    }
  }

  markAllRead(): void {
    this.items.update((items) =>
      items.map((notification) => ({ ...notification, read: true }))
    );
  }

  markRead(id: string): void {
    this.items.update((items) =>
      items.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }

  private receive(payload: OrderStatusChangedNotification): void {
    this.notificationSequence += 1;
    const notification: OrderNotification = {
      ...payload,
      id: `${payload.orderId}-${this.notificationSequence}`,
      receivedAt: new Date(),
      read: false,
    };

    this.items.update((items) =>
      [notification, ...items].slice(0, MAX_NOTIFICATIONS)
    );
    this.orderStatusChanged.next(notification);
  }
}
