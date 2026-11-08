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
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-user-order-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    DatePipe,
  ],
  template: `
    <table
      mat-table
      [dataSource]="userOrders"
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

      <ng-container matColumnDef="imageUrl">
        <th mat-header-cell *matHeaderCellDef>Image</th>
        <td mat-cell *matCellDef="let element">
          <img
            [src]="baseUrl + element.imageUrl"
            alt="image"
            style="width: 100px; height: 90px;"
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
          Title
        </th>
        <td mat-cell *matCellDef="let element">{{ element.title }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let element">{{ element.quantity }}</td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th
          mat-header-cell
          *matHeaderCellDef
          mat-sort-header
          sortActionDescription="sort by price"
        >
          Price
        </th>
        <td mat-cell *matCellDef="let element">{{ element.price }}</td>
      </ng-container>

      <ng-container matColumnDef="authorNames">
        <th mat-header-cell *matHeaderCellDef>Authors</th>
        <td mat-cell *matCellDef="let element">{{ element.authorNames }}</td>
      </ng-container>

      <ng-container matColumnDef="genreNames">
        <th mat-header-cell *matHeaderCellDef>Genres</th>
        <td mat-cell *matCellDef="let element">{{ element.genreNames }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderListComponent {
  @Input({ required: true }) userOrders!: readonly MyOrderModel[];
  @Output() sort = new EventEmitter<SortModel>();
  baseUrl = environment.baseUrl + "/resources/";

  displayedColumns = [
    "orderDate",
    "title",
    "imageUrl",
    "price",
    "quantity",
    "authorNames",
    "genreNames",
  ];

  sortData(sortData: Sort) {
    this.sort.emit({
      sortColumn: sortData.active,
      sortDirection: sortData.direction as "asc" | "desc",
    });
  }
}
