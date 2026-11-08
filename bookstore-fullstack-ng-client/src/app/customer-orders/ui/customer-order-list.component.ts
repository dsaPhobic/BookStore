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
import { DatePipe } from "@angular/common";
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
    RouterModule,
    MatButtonModule,
  ],
  template: `
    <table
      mat-table
      [dataSource]="customerOrders"
      matSort
      (matSortChange)="sortData($event)"
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

      <ng-container matColumnDef="name">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by name"
        >
          Name
        </th>
        <td mat-cell *matCellDef="let element">
          {{ element.name }}
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
        <th mat-header-cell *matHeaderCellDef>SubTotal</th>
        <td mat-cell *matCellDef="let element">₹{{ element.subTotal }}</td>
      </ng-container>

      <ng-container matColumnDef="tax">
        <th mat-header-cell *matHeaderCellDef>Tax</th>
        <td mat-cell *matCellDef="let element">₹{{ element.tax }}</td>
      </ng-container>

      <ng-container matColumnDef="total">
        <th mat-header-cell *matHeaderCellDef>Total</th>
        <td mat-cell *matCellDef="let element">₹{{ element.total }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let element">
          <button
            mat-raised-button
            color="primary"
            routerLink="/customer-orders/detail/{{ element.id }}"
          >
            Detail
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [``],
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
