import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreateOrderFormComponent } from "./ui/create-order-form.component";
import { OrderCreateModel } from "./data/order-create.model";
import { OrderService } from "./data/order.service";
import { AsyncPipe } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { CartActions } from "../cart/state/cart.actions";

@Component({
  selector: "app-create-order",
  standalone: true,
  imports: [CreateOrderFormComponent, AsyncPipe, RouterModule],
  template: `
    <h2>Checkout</h2>

    <app-create-order-form
      [paymentMethods]="(paymentMethods$ | async) ?? []"
      (onOrderSubmit)="handleOrderSubmit($event)"
    />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderComponent {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private store = inject(Store);
  paymentMethods$ = this.orderService.getPaymentMethods();

  handleOrderSubmit(orderToCreate: OrderCreateModel) {
    this.orderService.createOrder(orderToCreate).subscribe({
      next: () => {
        this.store.dispatch(CartActions.emptyCartItemState());
        this.router.navigate(["/order-success"]);
      },
      error: () => {
        this.router.navigate(["/order-failure"]);
      },
    });
  }
}
