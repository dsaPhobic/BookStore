import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { map, Observable, of, switchMap } from "rxjs";
import { OrderService } from "../order/data/order.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { OrderItem } from "../order/data/user-order.model";
import { CustomerOrderDetailListComponent } from "./ui/customer-order-detail-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CustomerOrderDetailListComponent,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="order-detail-page bs-fade-in">
      <div class="bs-page-header">
        <div>
          <span class="bs-badge bs-badge--primary" style="margin-bottom: 8px">
            Order #{{ orderId$ | async }}
          </span>
          <h1 class="bs-page-title">Order Line Items</h1>
          <p class="bs-page-subtitle">
            Detailed list of books included in this customer order.
          </p>
        </div>
        <a mat-stroked-button routerLink="/customer-order">
          <mat-icon>arrow_back</mat-icon>
          Back to Orders
        </a>
      </div>

      <ng-container *ngIf="orderItems$ | async as orderItems">
        <div class="bs-table-shell">
          <app-customer-order-detail-list [OrderItems]="orderItems" />
        </div>
      </ng-container>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  orderId$ = this.route.paramMap.pipe(map((params) => params.get("id")));
  orderItems$: Observable<OrderItem[] | null> = this.orderId$.pipe(
    switchMap((id) => {
      if (id) {
        return this.orderService.getOrderItemsByOrderId(parseInt(id));
      } else {
        return of(null);
      }
    })
  );
}
