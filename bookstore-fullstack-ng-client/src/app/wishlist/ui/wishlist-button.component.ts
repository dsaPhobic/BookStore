import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoginState } from "../../account/state/account.selectors";
import { BookReadModel } from "../../book/Data/book-read.model";
import { WishlistStore } from "../wishlist.store";

@Component({
  selector: "app-wishlist-button",
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
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
      <mat-icon>{{ wishlistStore.has(book.id) ? "favorite" : "favorite_border" }}</mat-icon>
      @if (!compact) {
        <span>{{ wishlistStore.has(book.id) ? "Saved" : "Wishlist" }}</span>
      }
    </button>
  `,
  styles: [
    `
      .wishlist-button.active {
        color: #c62828;
        border-color: rgba(198, 40, 40, 0.35);
      }

      .wishlist-button.compact {
        min-width: 40px;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
      }

      .wishlist-button.compact .mat-icon {
        margin: 0;
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
