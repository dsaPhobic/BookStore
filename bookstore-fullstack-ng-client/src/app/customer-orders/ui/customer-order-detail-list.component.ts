import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { environment } from "../../../environments/environment.development";
import { OrderItem } from "../../order/data/user-order.model";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "app-customer-order-detail-list",
  standalone: true,
  imports: [MatTableModule, CurrencyPipe],
  template: `
    <div class="table-scroll">
      <table mat-table [dataSource]="OrderItems">
        <ng-container matColumnDef="imageUrl">
          <th mat-header-cell *matHeaderCellDef>Cover</th>
          <td mat-cell *matCellDef="let element">
            <img
              [src]="baseUrl + element.book.imageUrl"
              [alt]="element.book.title"
              class="order-thumb"
            />
          </td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Book Title</th>
          <td mat-cell *matCellDef="let element">
            <strong>{{ element.book.title }}</strong>
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
            <span class="bs-badge bs-badge--accent">
              {{ element.book.genreNames }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let element">
            <strong>{{ element.price | currency : "INR" }}</strong>
          </td>
        </ng-container>

        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Quantity</th>
          <td mat-cell *matCellDef="let element">
            <span class="bs-badge bs-badge--primary">×{{ element.quantity }}</span>
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrderDetailListComponent {
  @Input({ required: true }) OrderItems!: OrderItem[];
  baseUrl = environment.baseUrl + "/resources/";

  displayedColumns = [
    "imageUrl",
    "title",
    "authorNames",
    "genreNames",
    "price",
    "quantity",
  ];
}
