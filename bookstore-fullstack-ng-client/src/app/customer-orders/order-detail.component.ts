import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, of, switchMap } from "rxjs";
import { OrderService } from "../order/data/order.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { OrderItem } from "../order/data/user-order.model";
import { CustomerOrderDetailListComponent } from "./ui/customer-order-detail-list.component";

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [NgIf, AsyncPipe, CustomerOrderDetailListComponent],
  template: `
    <h1>Order Detail</h1>
    <ng-container *ngIf="orderItems$ | async as orderItems">
      <app-customer-order-detail-list [OrderItems]="orderItems" />
    </ng-container>
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
