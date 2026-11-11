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
import { environment } from "../../../environments/environment.development";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { UserOrderModel } from "../../order/data/user-order.model";
import { RouterModule } from "@angular/router";

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
          <th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let element">
            <strong class="total-amount">{{ element.total | currency : "INR" }}</strong>
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
        color: var(--bs-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrderListComponent {
  @Input({ required: true }) customerOrders!: readonly UserOrderModel[];
  @Output() sort = new EventEmitter<SortModel>();
  baseUrl = environment.baseUrl + "/resources/";

  displayedColumns = [
    "orderDate",
    "name",
    "email",
    "mobileNumber",
    "subTotal",
    "tax",
    "total",
    "actions",
  ];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
