import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { catchError, map, of, switchMap } from "rxjs";
import { BookService } from "../book/Data/book.service";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { environment } from "../../environments/environment.development";
import { BookReadModel } from "../book/Data/book-read.model";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-book-detail",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="breadcrumb-row">
      <a mat-button routerLink="/books">
        <mat-icon>arrow_back</mat-icon>
        Back to Catalog
      </a>
    </div>

    <ng-container *ngIf="book$ | async as book">
      <div class="detail-card surface-card">
        <div class="cover-panel">
          <img
            *ngIf="book.imageUrl; else noCover"
            [src]="imageBaseUrl + book.imageUrl"
            [alt]="book.title"
            class="detail-cover"
          />
          <ng-template #noCover>
            <div class="no-cover">
              <mat-icon>menu_book</mat-icon>
              <span>{{ book.title }}</span>
            </div>
          </ng-template>
        </div>

        <div class="info-panel">
          <div class="chip-row" *ngIf="book.genres?.length">
            <span class="chip" *ngFor="let g of book.genres">
              {{ g.genreName }}
            </span>
          </div>

          <h1 class="detail-title">{{ book.title }}</h1>

          <div class="meta-line">
            <span>
              <mat-icon>person_outline</mat-icon>
              <strong>{{ book.authorNames || "Unknown Author" }}</strong>
            </span>
            <span *ngIf="book.publishedYear">
              <mat-icon>calendar_today</mat-icon>
              Published {{ book.publishedYear }}
            </span>
          </div>

          <div class="price-box">
            <span class="price-label">Price</span>
            <span class="detail-price">\${{ book.price }}</span>
            <span class="stock-tag">
              <mat-icon>check_circle</mat-icon> In Stock
            </span>
          </div>

          <div class="desc-section">
            <h3>Synopsis & Overview</h3>
            <p>{{ book.description }}</p>
          </div>

          <div class="action-row">
            <button
              mat-flat-button
              color="accent"
              (click)="addToCart(book)"
              class="buy-btn"
            >
              <mat-icon>shopping_bag</mat-icon>
              Add to Shopping Cart
            </button>
            <a mat-stroked-button routerLink="/cart">
              View Cart
            </a>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .breadcrumb-row {
        margin-bottom: 16px;
      }

      .detail-card {
        display: grid;
        grid-template-columns: 340px 1fr;
        gap: 40px;
        padding: 32px;
        align-items: start;
      }

      .cover-panel {
        background: var(--bs-surface-2);
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius);
        overflow: hidden;
        aspect-ratio: 3 / 4;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .detail-cover {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .no-cover {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        color: var(--bs-muted);
      }

      .no-cover .mat-icon {
        font-size: 56px;
        width: 56px;
        height: 56px;
      }

      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .detail-title {
        font-size: 36px;
        margin: 0 0 12px;
        line-height: 1.2;
      }

      .meta-line {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        color: var(--bs-muted);
        font-size: 15px;
        margin-bottom: 24px;
      }

      .meta-line span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .meta-line .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .price-box {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: var(--bs-surface-2);
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius);
        margin-bottom: 24px;
      }

      .price-label {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--bs-muted);
      }

      .detail-price {
        font-size: 30px;
        font-weight: 700;
        color: var(--bs-ink-dark);
      }

      .stock-tag {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--bs-success-soft);
        color: var(--bs-success);
        font-size: 13px;
        font-weight: 600;
      }

      .stock-tag .mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .desc-section h3 {
        font-size: 18px;
        margin: 0 0 8px;
      }

      .desc-section p {
        margin: 0 0 28px;
        line-height: 1.7;
        color: var(--bs-text);
        font-size: 15.5px;
      }

      .action-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .buy-btn {
        height: 46px !important;
        padding: 0 26px !important;
      }

      @media (max-width: 820px) {
        .detail-card {
          grid-template-columns: 1fr;
          padding: 20px;
        }
        .cover-panel {
          max-width: 280px;
          margin: 0 auto;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent {
  imageBaseUrl = environment.baseUrl + "/resources/";
  route = inject(ActivatedRoute);
  store = inject(Store);
  id$ = this.route.paramMap.pipe(map((a) => a.get("id")));
  bookService = inject(BookService);
  snackBar = inject(MatSnackBar);

  addToCart(book: BookReadModel) {
    const cartItem: CartCreateModel = {
      bookId: book.id,
      quantity: 1,
    };
    this.store.dispatch(CartActions.addCartItem({ cartItem }));
    this.snackBar.open(`"${book.title}" added to cart`, "Close", {
      duration: 2500,
    });
  }

  book$ = this.id$.pipe(
    switchMap((id) => {
      if (!id) return of(null);
      return this.bookService.getBookById(parseInt(id));
    }),
    catchError((error) => {
      return of(error);
    })
  );
}
