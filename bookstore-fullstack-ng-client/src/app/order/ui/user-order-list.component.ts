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
import { MyOrderModel } from "../data/my-order.model";
import { environment } from "../../../environments/environment.development";
import { CurrencyPipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-user-order-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <div class="table-scroll">
      <table
        mat-table
        [dataSource]="userOrders"
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

        <ng-container matColumnDef="imageUrl">
          <th mat-header-cell *matHeaderCellDef>Cover</th>
          <td mat-cell *matCellDef="let element">
            <img
              [src]="baseUrl + element.imageUrl"
              [alt]="element.title"
              class="order-thumb"
            />
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by title"
          >
            Book Title
          </th>
          <td mat-cell *matCellDef="let element">
            <span class="book-title">{{ element.title }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Qty</th>
          <td mat-cell *matCellDef="let element">
            <span class="bs-badge bs-badge--primary">×{{ element.quantity }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th
            mat-header-cell
            *matHeaderCellDef
            mat-sort-header
            sortActionDescription="sort by price"
          >
            Unit Price
          </th>
          <td mat-cell *matCellDef="let element">
            <strong class="price-text">{{ element.price | currency : "INR" }}</strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="authorNames">
          <th mat-header-cell *matHeaderCellDef>Authors</th>
          <td mat-cell *matCellDef="let element">{{ element.authorNames }}</td>
        </ng-container>

        <ng-container matColumnDef="genreNames">
          <th mat-header-cell *matHeaderCellDef>Genres</th>
          <td mat-cell *matCellDef="let element">
            <span class="bs-badge bs-badge--accent">{{ element.genreNames }}</span>
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
      .order-thumb {
        width: 48px;
        height: 64px;
        object-fit: cover;
        border-radius: 6px;
        box-shadow: var(--bs-shadow-sm);
      }
      .book-title {
        font-weight: 600;
        color: var(--bs-text);
      }
      .price-text {
        color: var(--bs-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderListComponent {
  @Input({ required: true }) userOrders!: readonly MyOrderModel[];
  @Output() sort = new EventEmitter<SortModel>();
  baseUrl = environment.baseUrl + "/resources/";

  displayedColumns = [
    "orderDate",
    "imageUrl",
    "title",
    "authorNames",
    "genreNames",
    "quantity",
    "price",
  ];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
