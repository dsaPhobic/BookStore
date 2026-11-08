import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { environment } from "../../../environments/environment.development";
import { OrderItem } from "../../order/data/user-order.model";

@Component({
  selector: "app-customer-order-detail-list",
  standalone: true,
  imports: [MatTableModule],
  template: `
    <table mat-table [dataSource]="OrderItems" matSort class="mat-elevation-z8">
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Book</th>
        <td mat-cell *matCellDef="let element">{{ element.book.title }}</td>
      </ng-container>

      <ng-container matColumnDef="imageUrl">
        <th mat-header-cell *matHeaderCellDef>Image</th>
        <td mat-cell *matCellDef="let element">
          <img
            [src]="baseUrl + element.book.imageUrl"
            alt="image"
            style="width:100px;height:80px"
          />
        </td>
      </ng-container>

      <ng-container matColumnDef="authorNames">
        <th mat-header-cell *matHeaderCellDef>Authors</th>
        <td mat-cell *matCellDef="let element">
          {{ element.book.authorNames }}
        </td>
      </ng-container>

      <ng-container matColumnDef="genreNames">
        <th mat-header-cell *matHeaderCellDef>Genres</th>
        <td mat-cell *matCellDef="let element">
          {{ element.book.genreNames }}
        </td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let element">₹ {{ element.price }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef>Quantity</th>
        <td mat-cell *matCellDef="let element">
          {{ element.quantity }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrderDetailListComponent {
  @Input({ required: true }) OrderItems!: OrderItem[];
  baseUrl = environment.baseUrl + "/resources/";

  displayedColumns = [
    "title",
    "imageUrl",
    "authorNames",
    "genreNames",
    "price",
    "quantity",
  ];
}
