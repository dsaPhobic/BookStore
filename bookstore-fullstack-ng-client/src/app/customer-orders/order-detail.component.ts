import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { BehaviorSubject, combineLatest, map, switchMap } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
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
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    CustomerOrderDetailListComponent,
  ],
  template: `
    <ng-container *ngIf="order$ | async as order">
      <div class="page-header">
        <h1>Order #{{ order.id }}</h1>
        <button mat-stroked-button routerLink="/customer-order">
          Back to orders
        </button>
      </div>

      <mat-card class="summary">
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Customer</span>
            <span>{{ order.name }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Email</span>
            <span>{{ order.email }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Mobile</span>
            <span>{{ order.mobileNumber }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Order date</span>
            <span>{{ order.orderDate | date : "dd-MMM-yyyy HH:mm" }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Sub total</span>
            <span>₹{{ order.subTotal }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Tax</span>
            <span>₹{{ order.tax }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total</span>
            <span class="total">₹{{ order.total }}</span>
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
            mat-raised-button
            color="primary"
            [disabled]="
              updating ||
              isTerminal(order.orderStatus) ||
              (selectedStatus ?? order.orderStatus) === order.orderStatus
            "
            (click)="updateStatus(order)"
          >
            Update status
          </button>
        </div>

        <p class="hint" *ngIf="isTerminal(order.orderStatus)">
          This order is in a terminal state and its status can no longer be
          changed.
        </p>
      </mat-card>

      <h2>Order items</h2>
      <app-customer-order-detail-list [OrderItems]="order.orderItems" />
    </ng-container>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .summary {
        margin-bottom: 1.5rem;
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .summary-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #666;
      }

      .total {
        font-weight: 700;
      }

      .status-form {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .status-select {
        width: 220px;
      }

      .status-chip {
        display: inline-block;
        align-self: flex-start;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
      }

      .status-pending {
        background-color: #f0ad4e;
        color: #212529;
      }

      .status-processing {
        background-color: #0d6efd;
      }

      .status-shipped {
        background-color: #6f42c1;
      }

      .status-delivered {
        background-color: #198754;
      }

      .status-cancelled {
        background-color: #dc3545;
      }

      .status-unknown {
        background-color: #6c757d;
      }

      .hint {
        margin: 0.5rem 0 0;
        color: #666;
        font-size: 13px;
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
