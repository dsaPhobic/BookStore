import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreateOrderFormComponent } from "./ui/create-order-form.component";
import { OrderCreateModel } from "./data/order-create.model";
import { OrderService } from "./data/order.service";
import { AsyncPipe } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { CartActions } from "../cart/state/cart.actions";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-create-order",
  standalone: true,
  imports: [
    CreateOrderFormComponent,
    AsyncPipe,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="checkout-page bs-fade-in">
      <div class="bs-page-header">
        <div>
          <span class="bs-badge bs-badge--accent" style="margin-bottom: 8px">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px">
              lock
            </mat-icon>
            Secure Checkout
          </span>
          <h1 class="bs-page-title">Complete Your Order</h1>
          <p class="bs-page-subtitle">
            Confirm your shipping details and choose your preferred payment method.
          </p>
        </div>
        <a mat-stroked-button routerLink="/cart" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
          Back to Cart
        </a>
      </div>

      <app-create-order-form
        [paymentMethods]="(paymentMethods$ | async) ?? []"
        (onOrderSubmit)="handleOrderSubmit($event)"
      />
    </div>
  `,
  styles: [
    `
      .checkout-page {
        max-width: 780px;
        margin: 0 auto;
      }
      .back-btn {
        border-radius: 999px !important;
      }
    `,
  ],
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
