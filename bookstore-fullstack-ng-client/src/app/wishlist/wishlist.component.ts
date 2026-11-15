import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { BookReadModel } from "../book/Data/book-read.model";
import { BookListPublicComponent } from "../book-public/ui/book-list-public.component";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";
import { WishlistStore } from "./wishlist.store";

@Component({
  selector: "app-wishlist",
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BookListPublicComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <span class="eyebrow">YOUR COLLECTION</span>
        <h1>My Wishlist</h1>
        <p class="page-subtitle">
          Keep track of books you want to read or purchase later.
        </p>
      </div>
      <a mat-stroked-button routerLink="/books">
        <mat-icon>auto_stories</mat-icon>
        Browse books
      </a>
    </div>

    <div class="loading-center" *ngIf="wishlistStore.loading()">
      <mat-spinner diameter="42"></mat-spinner>
    </div>

    <div class="surface-card error-state" *ngIf="wishlistStore.error() as error">
      <mat-icon>error_outline</mat-icon>
      <div>
        <h3>Unable to update your wishlist</h3>
        <p>{{ error }}</p>
      </div>
      <button mat-stroked-button type="button" (click)="retry()">
        <mat-icon>refresh</mat-icon>
        Retry
      </button>
    </div>

    <ng-container *ngIf="!wishlistStore.loading()">
      <app-book-list-public
        *ngIf="wishlistStore.items().length; else emptyWishlist"
        [books]="books()"
        (addToCart)="addToCart($event)"
      />

      <ng-template #emptyWishlist>
        <div class="surface-card empty-state" *ngIf="!wishlistStore.error()">
          <mat-icon>favorite_border</mat-icon>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on a book to save it here.</p>
          <a mat-flat-button color="primary" routerLink="/books">
            Explore books
          </a>
        </div>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      .page-header {
        align-items: center;
      }

      .error-state {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        margin-bottom: 24px;
      }

      .error-state > div {
        flex: 1;
      }

      .error-state h3,
      .error-state p {
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistComponent {
  readonly wishlistStore = inject(WishlistStore);
  readonly books = computed(() =>
    this.wishlistStore.items().map((item) => item.book)
  );
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.wishlistStore.load();
  }

  retry(): void {
    this.wishlistStore.load(true);
  }

  addToCart(book: BookReadModel): void {
    const cartItem: CartCreateModel = { bookId: book.id, quantity: 1 };
    this.store.dispatch(CartActions.addCartItem({ cartItem }));
    this.snackBar.open(`"${book.title}" added to cart`, "Close", {
      duration: 2500,
    });
  }
}
