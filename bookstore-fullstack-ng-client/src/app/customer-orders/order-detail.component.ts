import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import {
  AsyncPipe,
  CurrencyPipe,
  DatePipe,
  NgClass,
  NgFor,
  NgIf,
} from "@angular/common";
import { BehaviorSubject, combineLatest, map, switchMap } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { OrderService } from "../order/data/order.service";
import { UserOrderModel } from "../order/data/user-order.model";
import { CustomerOrderDetailListComponent } from "./ui/customer-order-detail-list.component";
import {
  ORDER_STATUS_OPTIONS,
  getOrderStatusCssClass,
  getOrderStatusLabel,
  isOrderStatusTransitionAllowed,
  isTerminalOrderStatus,
} from "../order/data/order-status";

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    CustomerOrderDetailListComponent,
  ],
  template: `
    <div class="order-detail-page bs-fade-in">
      <div class="bs-page-header">
        <div>
          <span class="bs-badge bs-badge--primary" style="margin-bottom: 8px">
            Order #{{ orderId$ | async }}
          </span>
          <h1 class="bs-page-title">Order Details</h1>
          <p class="bs-page-subtitle">
            Review the customer, pricing breakdown, fulfillment status, and
            ordered books.
          </p>
        </div>
        <a mat-stroked-button routerLink="/customer-order">
          <mat-icon>arrow_back</mat-icon>
          Back to Orders
        </a>
      </div>

      <ng-container *ngIf="order$ | async as order">
        <div class="summary surface-card">
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">Customer</span>
              <span class="value">{{ order.name }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Email</span>
              <span class="value">{{ order.email }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Mobile</span>
              <span class="value">{{ order.mobileNumber }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Order date</span>
              <span class="value">{{
                order.orderDate | date : "dd MMM yyyy, HH:mm"
              }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Subtotal</span>
              <span class="value">{{ order.subTotal | currency : "USD" }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Tax</span>
              <span class="value">{{ order.tax | currency : "USD" }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Total</span>
              <span class="value total">{{
                order.total | currency : "USD"
              }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Status</span>
              <span
                class="status-chip"
                [ngClass]="statusClass(order.orderStatus)"
              >
                {{ statusLabel(order.orderStatus) }}
              </span>
            </div>
          </div>

          <div class="status-form">
            <mat-form-field appearance="outline" class="status-select">
              <mat-label>Order status</mat-label>
              <mat-select
                [value]="selectedStatus ?? order.orderStatus"
                [disabled]="isTerminal(order.orderStatus) || updating"
                (selectionChange)="selectedStatus = $event.value"
              >
                <mat-option
                  *ngFor="let option of statusOptions"
                  [value]="option.value"
                  [disabled]="
                    option.value !== order.orderStatus &&
                    !isTransitionAllowed(order.orderStatus, option.value)
                  "
                >
                  {{ option.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <button
              mat-flat-button
              color="primary"
              [disabled]="
                updating ||
                isTerminal(order.orderStatus) ||
                (selectedStatus ?? order.orderStatus) === order.orderStatus
              "
              (click)="updateStatus(order)"
            >
              <mat-icon>sync</mat-icon>
              Update status
            </button>
          </div>

          <p class="hint" *ngIf="isTerminal(order.orderStatus)">
            This order is in a terminal state and its status can no longer be
            changed.
          </p>
        </div>

        <h2 class="section-title">Order Line Items</h2>
        <div class="bs-table-shell">
          <app-customer-order-detail-list [OrderItems]="order.orderItems" />
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .summary {
        margin-bottom: 24px;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 18px;
        margin-bottom: 20px;
      }

      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--bs-muted);
      }

      .value {
        color: var(--bs-text);
        font-weight: 500;
      }

      .total {
        font-weight: 700;
        color: var(--bs-ink);
      }

      .status-form {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        padding-top: 16px;
        border-top: 1px solid var(--bs-border);
      }

      .status-select {
        width: 220px;
      }

      .status-chip {
        display: inline-block;
        align-self: flex-start;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }

      .status-pending {
        background-color: #d99a2b;
        color: #2b2100;
      }

      .status-processing {
        background-color: #3d6fd6;
      }

      .status-shipped {
        background-color: #7a5bc4;
      }

      .status-delivered {
        background-color: var(--bs-success);
      }

      .status-cancelled {
        background-color: #d9534f;
      }

      .status-unknown {
        background-color: #8b8f9c;
      }

      .hint {
        margin: 12px 0 0;
        color: var(--bs-muted);
        font-size: 13px;
      }

      .section-title {
        font-size: 22px;
        margin: 0 0 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  statusOptions = ORDER_STATUS_OPTIONS;
  selectedStatus: number | null = null;
  updating = false;

  private refresh$ = new BehaviorSubject<void>(undefined);

  orderId$ = this.route.paramMap.pipe(map((params) => params.get("id")));

  order$ = combineLatest([
    this.route.paramMap.pipe(map((params) => Number(params.get("id")))),
    this.refresh$,
  ]).pipe(switchMap(([orderId]) => this.orderService.getOrder(orderId)));

  statusLabel(status: number) {
    return getOrderStatusLabel(status);
  }

  statusClass(status: number) {
    return getOrderStatusCssClass(status);
  }

  isTerminal(status: number) {
    return isTerminalOrderStatus(status);
  }

  isTransitionAllowed(current: number, next: number) {
    return isOrderStatusTransitionAllowed(current, next);
  }

  updateStatus(order: UserOrderModel) {
    const nextStatus = this.selectedStatus ?? order.orderStatus;
    if (nextStatus === order.orderStatus) {
      return;
    }

    this.updating = true;
    this.orderService.updateOrderStatus(order.id, nextStatus).subscribe({
      next: () => {
        this.updating = false;
        this.selectedStatus = null;
        this.snackBar.open(
          `Order status updated to ${getOrderStatusLabel(nextStatus)}`,
          "Dismiss",
          { duration: 3000 }
        );
        this.refresh$.next();
      },
      error: (error) => {
        this.updating = false;
        this.snackBar.open(
          error?.error?.message ?? "Failed to update the order status",
          "Dismiss",
          { duration: 5000 }
        );
      },
    });
  }
}
