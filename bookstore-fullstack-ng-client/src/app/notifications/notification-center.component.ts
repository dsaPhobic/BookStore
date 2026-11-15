import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { NotificationService } from "./notification.service";
import { OrderNotification } from "./order-status-changed.model";
import { getOrderStatusCssClass } from "../order/data/order-status";

/**
 * Header bell that lists the order status updates received over SignalR
 * during this session.
 */
@Component({
  selector: "app-notification-center",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  template: `
    <button
      mat-icon-button
      class="notification-trigger"
      [matMenuTriggerFor]="notificationMenu"
      [attr.aria-label]="
        unreadCount() > 0
          ? 'Order notifications, ' + unreadCount() + ' unread'
          : 'Order notifications'
      "
    >
      <mat-icon
        [matBadge]="unreadCount()"
        [matBadgeHidden]="unreadCount() === 0"
        matBadgeColor="accent"
        matBadgeSize="small"
        matBadgePosition="above after"
        >notifications_none</mat-icon
      >
    </button>

    <mat-menu #notificationMenu="matMenu" xPosition="before">
      <div class="panel">
        <div class="panel-head">
          <span class="panel-title">Order updates</span>
          <button
            *ngIf="unreadCount() > 0"
            type="button"
            class="mark-read"
            (click)="markAllRead()"
          >
            Mark all as read
          </button>
        </div>

        <mat-divider></mat-divider>

        <div *ngIf="notifications().length === 0" class="panel-empty">
          <mat-icon>notifications_none</mat-icon>
          <p>
            No updates yet. We'll let you know as soon as an order changes
            status.
          </p>
        </div>

        <button
          *ngFor="let notification of notifications()"
          mat-menu-item
          type="button"
          class="notification-item"
          [class.is-unread]="!notification.read"
          (click)="open(notification)"
        >
          <span
            class="status-dot"
            [ngClass]="statusClass(notification.orderStatus)"
          ></span>
          <span class="notification-body">
            <span class="notification-message">
              Order #{{ notification.orderId }} is now
              {{ notification.orderStatusLabel }}
            </span>
            <span class="notification-meta">
              Changed from {{ notification.previousStatusLabel }},
              {{ timeAgo(notification.receivedAt) }}
            </span>
          </span>
        </button>

        <mat-divider *ngIf="notifications().length > 0"></mat-divider>

        <button
          mat-menu-item
          type="button"
          class="panel-footer"
          (click)="openOrders()"
        >
          View all orders
        </button>
      </div>
    </mat-menu>
  `,
  styles: [
    `
      .notification-trigger {
        color: var(--bs-ink-dark);
      }

      .panel {
        width: 340px;
        max-width: calc(100vw - 32px);
      }

      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
      }

      .panel-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--bs-ink-dark);
        letter-spacing: 0.01em;
      }

      .mark-read {
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        font-size: 12px;
        font-weight: 600;
        color: var(--bs-accent);
        cursor: pointer;
        border-radius: 4px;
      }

      .mark-read:hover {
        color: var(--bs-accent-hover);
      }

      .mark-read:focus-visible {
        outline: 2px solid var(--bs-accent);
        outline-offset: 3px;
      }

      .panel-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 28px 24px;
        text-align: center;
      }

      .panel-empty .mat-icon {
        color: var(--bs-border);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .panel-empty p {
        margin: 0;
        max-width: 240px;
        font-size: 12.5px;
        line-height: 1.55;
        color: var(--bs-muted);
      }

      .notification-item.mat-mdc-menu-item {
        height: auto;
        min-height: 0;
        padding: 11px 16px;
        line-height: 1.4;
        white-space: normal;
        border-radius: 0;
      }

      .notification-item.mat-mdc-menu-item.is-unread {
        background: var(--bs-accent-soft);
      }

      .notification-item .status-dot {
        flex: 0 0 auto;
        width: 8px;
        height: 8px;
        margin-right: 12px;
        border-radius: 50%;
        background: #8b8f9c;
      }

      .notification-item .notification-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .notification-item .notification-message {
        font-size: 13px;
        font-weight: 600;
        color: var(--bs-ink-dark);
      }

      .notification-item .notification-meta {
        font-size: 11.5px;
        font-weight: 500;
        color: var(--bs-muted);
      }

      .panel-footer.mat-mdc-menu-item {
        height: 42px;
        font-size: 12.5px;
        font-weight: 600;
        color: var(--bs-accent);
      }

      .status-pending {
        background: #d99a2b;
      }

      .status-processing {
        background: #3d6fd6;
      }

      .status-shipped {
        background: #7a5bc4;
      }

      .status-delivered {
        background: var(--bs-success);
      }

      .status-cancelled {
        background: #d9534f;
      }

      .status-unknown {
        background: #8b8f9c;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationCenterComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly notifications = this.notificationService.notifications;
  readonly unreadCount = this.notificationService.unreadCount;

  statusClass(status: number): string {
    return getOrderStatusCssClass(status);
  }

  timeAgo(receivedAt: Date): string {
    const seconds = Math.max(
      0,
      Math.round((Date.now() - receivedAt.getTime()) / 1000)
    );
    if (seconds < 60) {
      return "just now";
    }

    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    const hours = Math.round(minutes / 60);
    if (hours < 24) {
      return `${hours} h ago`;
    }

    return `${Math.round(hours / 24)} d ago`;
  }

  open(notification: OrderNotification): void {
    this.notificationService.markRead(notification.id);
    this.router.navigate(["/my-orders"]);
  }

  openOrders(): void {
    this.router.navigate(["/my-orders"]);
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }
}
