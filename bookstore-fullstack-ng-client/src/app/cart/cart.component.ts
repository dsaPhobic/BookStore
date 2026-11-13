import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Store } from "@ngrx/store";
import { CartActions } from "./state/cart.actions";
import { combineLatest, map, Observable } from "rxjs";
import { CartItem } from "./data/cart-read.model";
import {
  selectCartError,
  selectCartItems,
  selectCartLoading,
} from "./state/cart.selectors";
import { HttpErrorResponse } from "@angular/common/http";
import { CartItemComponent } from "./ui/cart-item.component";
import { ClassSummaryComponent } from "./ui/cart-summary.component";
import { CartUpdateModel } from "./data/cart-update.model";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    CartItemComponent,
    ClassSummaryComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <span class="eyebrow">YOUR BAG</span>
        <h1>Shopping Cart</h1>
      </div>
      <a mat-stroked-button routerLink="/books">
        <mat-icon>arrow_back</mat-icon> Continue Shopping
      </a>
    </div>

    <ng-container *ngIf="cartItems$ | async as cartItems">
      <ng-container *ngIf="cartItems.length > 0; else noitems">
        <div class="cart-grid">
          <div class="cart-items-col">
            <app-cart-item
              *ngFor="let cartItem of cartItems; trackBy: trackById"
              [cartItem]="cartItem"
              (selectQuantity)="onSelectQuantity($event)"
              (deleteItem)="onDeleteItem($event)"
            />
          </div>
          <app-cart-summary
            [subTotal]="(subTotal$ | async) ?? 0"
            [tax]="(tax$ | async) ?? 0"
            [total]="(total$ | async) ?? 0"
          />
        </div>
      </ng-container>

      <ng-template #noitems>
        <div class="surface-card empty-state">
          <mat-icon>shopping_bag</mat-icon>
          <h3>Your cart is currently empty</h3>
          <p>Explore our catalog and add your favorite books to get started.</p>
          <a mat-flat-button color="accent" routerLink="/books">
            Browse Books
          </a>
        </div>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      .cart-grid {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 28px;
        align-items: start;
      }

      .cart-items-col {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      @media (max-width: 860px) {
        .cart-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartComponent {
  private readonly store = inject(Store);
  cartItems$: Observable<ReadonlyArray<CartItem>> =
    this.store.select(selectCartItems);
  loading$: Observable<boolean> = this.store.select(selectCartLoading);
  error$: Observable<HttpErrorResponse | null> =
    this.store.select(selectCartError);

  subTotal$: Observable<number> = this.cartItems$.pipe(
    map((cartItems) => {
      return Number(
        cartItems
          .reduce((acc, curr) => acc + curr.book.price * curr.quantity, 0)
          .toFixed(2)
      );
    })
  );
  taxInPercent = 18;

  tax$: Observable<number> = this.subTotal$.pipe(
    map((subTotal) => Number(((subTotal * this.taxInPercent) / 100).toFixed(2)))
  );

  total$ = combineLatest([this.subTotal$, this.tax$]).pipe(
    map(([subTotal, tax]) => Number((subTotal + tax).toFixed(2)))
  );

  trackById(index: number, cartItem: CartItem) {
    return cartItem.id;
  }

  private loadCartItems() {
    this.store.dispatch(CartActions.loadCartItems());
  }

  onSelectQuantity(data: { cartItem: CartItem; newQuantity: number }) {
    const cartItemToUpdate: CartUpdateModel = {
      id: data.cartItem.id,
      cartId: data.cartItem.cartId,
      bookId: data.cartItem.bookId,
      quantity: data.newQuantity,
    };
    this.store.dispatch(
      CartActions.updateCartItem({ cartItem: cartItemToUpdate })
    );
  }

  onDeleteItem(id: number) {
    if (window.confirm("Remove this book from your cart?")) {
      this.store.dispatch(CartActions.deleteCartItem({ id }));
    }
  }

  constructor() {
    this.loadCartItems();
  }
}
