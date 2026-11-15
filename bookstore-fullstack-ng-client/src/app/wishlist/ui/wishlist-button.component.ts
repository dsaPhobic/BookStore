import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoginState } from "../../account/state/account.selectors";
import { BookReadModel } from "../../book/Data/book-read.model";
import { WishlistStore } from "../wishlist.store";

@Component({
  selector: "app-wishlist-button",
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <button
      mat-stroked-button
      type="button"
      class="wishlist-button"
      [class.compact]="compact"
      [class.active]="wishlistStore.has(book.id)"
      [disabled]="wishlistStore.loading() || wishlistStore.isPending(book.id)"
      [attr.aria-label]="wishlistStore.has(book.id) ? 'Remove from wishlist' : 'Add to wishlist'"
      (click)="toggle($event)"
    >
      <svg
        class="wishlist-icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        @if (wishlistStore.has(book.id)) {
          <path
            d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"
          />
        } @else {
          <path
            d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05Z"
          />
        }
      </svg>
      @if (!compact) {
        <span>{{ wishlistStore.has(book.id) ? "Saved" : "Wishlist" }}</span>
      }
    </button>
  `,
  styles: [
    `
      .wishlist-button.active {
        color: #dc2626;
        border-color: rgba(220, 38, 38, 0.4);
      }

      .wishlist-icon {
        display: block;
        width: 24px;
        height: 24px;
        flex: 0 0 24px;
        fill: currentColor;
        color: #111827;
      }

      .wishlist-button.active .wishlist-icon {
        color: #dc2626;
      }

      .wishlist-button.compact {
        min-width: 40px;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
      }

      .wishlist-button.compact .wishlist-icon {
        margin: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WishlistButtonComponent {
  @Input({ required: true }) book!: BookReadModel;
  @Input() compact = false;

  readonly wishlistStore = inject(WishlistStore);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly isLoggedIn = toSignal(
    inject(Store).select(selectLoginState),
    { initialValue: false }
  );

  toggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isLoggedIn()) {
      this.snackBar.open("Please sign in to use your wishlist", "Close", {
        duration: 3000,
      });
      void this.router.navigate(["/login"]);
      return;
    }

    this.wishlistStore.toggle(this.book.id);
  }
}
