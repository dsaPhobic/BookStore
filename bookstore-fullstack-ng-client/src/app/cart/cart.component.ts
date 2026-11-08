import { AsyncPipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
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
  imports: [NgIf, NgFor, AsyncPipe, CartItemComponent, ClassSummaryComponent],
  template: `
    <div class="cart-container">
      <ng-container *ngIf="loading$ | async"> loading... </ng-container>
      <!-- if not error then #no-orror -->
      <ng-container *ngIf="error$ | async; else noerror">
        Error occured
      </ng-container>
      <ng-template #noerror>
        <ng-container *ngIf="cartItems$ | async as cartItems">
          <ng-container *ngIf="cartItems.length > 0; else noitems">
            <div class="cart-items">
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
          </ng-container>

          <ng-template #noitems>
            <h3>No items in the cart 🛒. Please <a href="/books">add ➕</a></h3>
          </ng-template>
        </ng-container>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .cart-container {
        display: flex;
        gap: 20px;
        padding: 15px;
      }

      .cart-items {
        width: 62%;
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
      return cartItems.reduce(
        (acc, curr) => (acc + curr.book.price) * curr.quantity,
        0
      );
    })
  );
  taxInPercent = 18;

  tax$: Observable<number> = this.subTotal$.pipe(
    map((subTotal) => (subTotal * this.taxInPercent) / 100)
  );

  total$ = combineLatest([this.subTotal$, this.tax$]).pipe(
    map(([subTotal, tax]) => subTotal + tax)
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
    if (window.confirm("Are you sure to delete?")) {
      this.store.dispatch(CartActions.deleteCartItem({ id }));
    }
  }

  constructor() {
    this.loadCartItems();
  }
}
