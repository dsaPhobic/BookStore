import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { SortModel } from "../../common/sort.model";
import { MatSortModule, Sort } from "@angular/material/sort";
import { CurrencyPipe, DatePipe, NgClass } from "@angular/common";
import { UserOrderModel } from "../../order/data/user-order.model";
import { RouterModule } from "@angular/router";
import {
  getOrderStatusCssClass,
  getOrderStatusLabel,
} from "../../order/data/order-status";

@Component({
  selector: "app-customer-order-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    DatePipe,
    CurrencyPipe,
    NgClass,
    RouterModule,
  ],
  template: `
    <div class="table-scroll">
      <table
        mat-table
        [dataSource]="customerOrders"
        matSort
        (matSortChange)="sortData($event)"
      >
        <ng-container matColumnDef="orderDate">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by orderDate"
          >
            Order Date
          </th>
          <td mat-cell *matCellDef="let element">
            <span class="bs-badge bs-badge--neutral">
              {{ element.orderDate | date : "dd MMM yyyy" }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let element">
            <span
              class="status-chip"
              [ngClass]="statusClass(element.orderStatus)"
            >
              {{ statusLabel(element.orderStatus) }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by name"
          >
            Customer
          </th>
          <td mat-cell *matCellDef="let element">
            <strong class="customer-name">{{ element.name }}</strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by email"
          >
            Email
          </th>
          <td mat-cell *matCellDef="let element">{{ element.email }}</td>
        </ng-container>

        <ng-container matColumnDef="mobileNumber">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by MobileNumber"
          >
            Mobile No.
          </th>
          <td mat-cell *matCellDef="let element">{{ element.mobileNumber }}</td>
        </ng-container>

        <ng-container matColumnDef="subTotal">
          <th mat-header-cell *matHeaderCellDef>Subtotal</th>
          <td mat-cell *matCellDef="let element">
            {{ element.subTotal | currency : "USD" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="tax">
          <th mat-header-cell *matHeaderCellDef>Tax</th>
          <td mat-cell *matCellDef="let element">
            {{ element.tax | currency : "USD" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let element">
            <strong class="total-amount">{{
              element.total | currency : "USD"
            }}</strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Items</th>
          <td mat-cell *matCellDef="let element">
            <a
              mat-stroked-button
              color="primary"
              routerLink="/customer-orders/detail/{{ element.id }}"
            >
              <mat-icon>visibility</mat-icon>
              View Details
            </a>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
  styles: [
    `
      .table-scroll {
        overflow-x: auto;
      }

      .customer-name {
        color: var(--bs-text);
      }

      .total-amount {
        color: var(--bs-ink);
      }

      .status-chip {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        white-space: nowrap;
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrderListComponent {
  @Input({ required: true }) customerOrders!: readonly UserOrderModel[];
  @Output() sort = new EventEmitter<SortModel>();

  displayedColumns = [
    "orderDate",
    "status",
    "name",
    "email",
    "mobileNumber",
    "subTotal",
    "tax",
    "total",
    "actions",
  ];

  statusLabel(status: number) {
    return getOrderStatusLabel(status);
  }

  statusClass(status: number) {
    return getOrderStatusCssClass(status);
  }

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
