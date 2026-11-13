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
import { DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
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
    NgClass,
    NgFor,
    NgIf,
  ],
  template: `
    <table
      mat-table
      [dataSource]="dataSource"
      matSort
      class="mat-elevation-z8"
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
          {{ element.orderDate | date : "dd-MMM-yyyy" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let element">
          <span class="status-chip" [ngClass]="statusClass(element.orderStatus)">
            {{ statusLabel(element.orderStatus) }}
          </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="books">
        <th mat-header-cell *matHeaderCellDef>Books</th>
        <td mat-cell *matCellDef="let element">
          <div *ngFor="let item of element.orderItems" class="book-line">
            {{ item.book.title }}
            <span class="muted">× {{ item.quantity }}</span>
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
          SubTotal
        </th>
        <td mat-cell *matCellDef="let element">₹{{ element.subTotal }}</td>
      </ng-container>

      <ng-container matColumnDef="tax">
        <th mat-header-cell *matHeaderCellDef>Tax</th>
        <td mat-cell *matCellDef="let element">₹{{ element.tax }}</td>
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
        <td mat-cell *matCellDef="let element" class="total">
          ₹{{ element.total }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>

    <p *ngIf="!dataSource.data.length" class="empty">
      You have not placed any order yet.
    </p>
  `,
  styles: [
    `
      table {
        width: 100%;
      }

      .book-line + .book-line {
        margin-top: 4px;
      }

      .muted {
        color: #666;
      }

      .total {
        font-weight: 600;
      }

      .empty {
        margin-top: 1rem;
      }

      .status-chip {
        display: inline-block;
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
