import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { UserOrderModel } from "../data/user-order.model";
import {
  getOrderStatusCssClass,
  getOrderStatusLabel,
} from "../data/order-status";

@Component({
  selector: "app-user-order-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    DatePipe,
    CurrencyPipe,
    NgClass,
    NgFor,
    NgIf,
  ],
  template: `
    <div class="table-scroll">
      <table mat-table [dataSource]="dataSource" matSort>
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

        <ng-container matColumnDef="books">
          <th mat-header-cell *matHeaderCellDef>Books</th>
          <td mat-cell *matCellDef="let element">
            <div *ngFor="let item of element.orderItems" class="book-line">
              <span class="book-title">{{ item.book.title }}</span>
              <span class="qty">×{{ item.quantity }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="subTotal">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by sub total"
          >
            Subtotal
          </th>
          <td mat-cell *matCellDef="let element">
            {{ element.subTotal | currency : "INR" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="tax">
          <th mat-header-cell *matHeaderCellDef>Tax</th>
          <td mat-cell *matCellDef="let element">
            {{ element.tax | currency : "INR" }}
          </td>
        </ng-container>

        <ng-container matColumnDef="total">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by total"
          >
            Total
          </th>
          <td mat-cell *matCellDef="let element">
            <strong class="total-amount">{{
              element.total | currency : "INR"
            }}</strong>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>

    <p *ngIf="!dataSource.data.length" class="empty">
      You have not placed any order yet.
    </p>
  `,
  styles: [
    `
      .table-scroll {
        overflow-x: auto;
      }

      .book-line + .book-line {
        margin-top: 4px;
      }

      .book-title {
        font-weight: 600;
        color: var(--bs-text);
      }

      .qty {
        margin-left: 6px;
        color: var(--bs-muted);
        font-size: 13px;
      }

      .total-amount {
        color: var(--bs-ink);
      }

      .empty {
        margin: 1rem 0 0;
        color: var(--bs-muted);
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
export class UserOrderListComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) userOrders!: readonly UserOrderModel[];

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<UserOrderModel>([]);

  displayedColumns = [
    "orderDate",
    "status",
    "books",
    "subTotal",
    "tax",
    "total",
  ];

  ngOnChanges() {
    this.dataSource.data = [...this.userOrders];
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  statusLabel(status: number) {
    return getOrderStatusLabel(status);
  }

  statusClass(status: number) {
    return getOrderStatusCssClass(status);
  }
}
