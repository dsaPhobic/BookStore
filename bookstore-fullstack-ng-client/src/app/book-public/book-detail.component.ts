import { DecimalPipe, NgFor, NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import { environment } from "../../environments/environment";
import { selectLoginState } from "../account/state/account.selectors";
import { BookReadModel } from "../book/Data/book-read.model";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { getImageUrl } from "../utils/image.utils";
import { CartActions } from "../cart/state/cart.actions";
import { PublicBookService } from "./data/public-book.service";
import { BookListPublicComponent } from "./ui/book-list-public.component";
import { WishlistButtonComponent } from "../wishlist/ui/wishlist-button.component";

type DetailStatus = "loading" | "success" | "notFound" | "error";

interface BookDetailResult {
  book: BookReadModel;
  relatedBooks: ReadonlyArray<BookReadModel>;
}

@Component({
  selector: "app-book-detail",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DecimalPipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BookListPublicComponent,
    WishlistButtonComponent,
  ],
  template: `
    <div class="breadcrumb-row">
      <a mat-button routerLink="/books">
        <mat-icon>arrow_back</mat-icon>
        Back to Catalog
      </a>
    </div>

    <div class="loading-center" *ngIf="status() === 'loading'">
      <mat-spinner diameter="42"></mat-spinner>
    </div>

    <div class="surface-card state-card" *ngIf="status() === 'notFound'">
      <mat-icon>menu_book</mat-icon>
      <h2>Book not found</h2>
      <p>The book address is invalid or the book is no longer available.</p>
      <a mat-flat-button color="primary" routerLink="/books">
        Browse the catalog
      </a>
    </div>

    <div class="surface-card state-card" *ngIf="status() === 'error'">
      <mat-icon>error_outline</mat-icon>
      <h2>Unable to load this book</h2>
      <p>{{ errorMessage() }}</p>
      <div class="state-actions">
        <button mat-stroked-button type="button" (click)="retry()">
          <mat-icon>refresh</mat-icon>
          Retry
        </button>
        <a mat-button routerLink="/books">Back to catalog</a>
      </div>
    </div>

    <ng-container *ngIf="status() === 'success' && book() as currentBook">
      <div class="detail-card surface-card">
        <div class="cover-panel">
          <img
            *ngIf="currentBook.imageUrl; else noCover"
            [src]="getImageUrl(currentBook.imageUrl)"
            [alt]="currentBook.title"
            class="detail-cover"
          />
          <ng-template #noCover>
            <div class="no-cover">
              <mat-icon>menu_book</mat-icon>
              <span>{{ currentBook.title }}</span>
            </div>
          </ng-template>
        </div>

        <div class="info-panel">
          <div class="chip-row" *ngIf="currentBook.genres.length">
            <span class="chip" *ngFor="let genre of currentBook.genres">
              {{ genre.genreName }}
            </span>
          </div>

          <h1 class="detail-title">{{ currentBook.title }}</h1>

          <div class="meta-line">
            <span>
              <mat-icon>person_outline</mat-icon>
              <strong>{{ authorText(currentBook) }}</strong>
            </span>
            <span *ngIf="currentBook.publishedYear">
              <mat-icon>calendar_today</mat-icon>
              Published {{ currentBook.publishedYear }}
            </span>
          </div>

          <div class="price-box">
            <span class="price-label">Price</span>
            <span class="detail-price">
              \${{ currentBook.price | number: "1.2-2" }}
            </span>
            <span
              class="stock-status"
              [class.out-of-stock]="currentBook.stockQuantity < 1"
              [class.low-stock]="currentBook.stockQuantity > 0 && currentBook.stockQuantity <= 5"
            >
              {{
                currentBook.stockQuantity > 5
                  ? currentBook.stockQuantity + " in stock"
                  : currentBook.stockQuantity > 0
                  ? "Only " + currentBook.stockQuantity + " left in stock!"
                  : "Out of stock"
              }}
            </span>
          </div>

          <div class="desc-section">
            <h3>Synopsis & Overview</h3>
            <p>{{ currentBook.description || "No description available." }}</p>
          </div>

          <div class="action-row">
            <button
              mat-flat-button
              (click)="addToCart(currentBook)"
              [disabled]="currentBook.stockQuantity < 1"
              class="buy-btn"
            >
              <mat-icon>{{ currentBook.stockQuantity > 0 ? "shopping_bag" : "remove_shopping_cart" }}</mat-icon>
              {{ currentBook.stockQuantity > 0 ? "Add to Shopping Cart" : "Out of Stock" }}
            </button>
            <app-wishlist-button [book]="currentBook" />
            <a mat-stroked-button routerLink="/cart" class="view-cart-btn">View Cart</a>
          </div>
        </div>
      </div>

      <section class="related-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">YOU MAY ALSO LIKE</span>
            <h2>Related books</h2>
          </div>
        </div>

        <p class="related-warning" *ngIf="relatedError()">
          Related books are temporarily unavailable.
        </p>

        <app-book-list-public
          *ngIf="relatedBooks().length; else noRelatedBooks"
          [books]="relatedBooks()"
          (addToCart)="addToCart($event)"
        />

        <ng-template #noRelatedBooks>
          <div class="surface-card related-empty" *ngIf="!relatedError()">
            No related books found for this title.
          </div>
        </ng-template>
      </section>
    </ng-container>
  `,
  styles: [
    `
      .breadcrumb-row {
        margin-bottom: 16px;
      }

      .state-card {
        text-align: center;
        padding: 48px 24px;
      }

      .state-card > .mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--bs-muted);
      }

      .state-card h2 {
        margin: 12px 0 6px;
      }

      .state-card p {
        color: var(--bs-muted);
        margin: 0 0 20px;
      }

      .state-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
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
        padding: 24px;
        text-align: center;
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
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--bs-muted);
      }

      .stock-status {
        margin-left: auto;
        color: #15803d;
        font-size: 14px;
        font-weight: 600;
      }

      .stock-status.out-of-stock {
        color: #b91c1c;
      }

      .stock-status.low-stock {
        color: #c2410c;
        font-weight: 700;
      }

      .detail-price {
        font-family: var(--bs-font-mono);
        font-size: 28px;
        font-weight: 700;
        color: var(--bs-ink);
        letter-spacing: -0.02em;
      }

      .desc-section h3 {
        font-size: 17px;
        font-weight: 700;
        color: var(--bs-ink);
        margin: 0 0 8px;
      }

      .desc-section p {
        margin: 0 0 28px;
        line-height: 1.7;
        color: #334155;
        max-width: 68ch;
      }

      .action-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }

      .buy-btn {
        background: var(--bs-ink) !important;
        color: #ffffff !important;
        height: 46px !important;
        padding: 0 24px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        border-radius: var(--bs-radius-sm) !important;
        transition: background 0.15s ease;
      }

      .buy-btn:hover {
        background: #1e293b !important;
      }

      .view-cart-btn {
        height: 46px !important;
        padding: 0 22px !important;
        border-radius: var(--bs-radius-sm) !important;
      }

      .related-section {
        margin-top: 40px;
      }

      .section-heading h2 {
        margin: 4px 0 20px;
      }

      .related-warning,
      .related-empty {
        color: var(--bs-muted);
      }

      .related-empty {
        padding: 24px;
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly publicBookService = inject(PublicBookService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly reload$ = new Subject<void>();

  readonly imageBaseUrl = `${environment.baseUrl}/resources/`;
  readonly status = signal<DetailStatus>("loading");

  getImageUrl(url?: string | null): string {
    return getImageUrl(url);
  }
  readonly book = signal<BookReadModel | null>(null);
  readonly relatedBooks = signal<ReadonlyArray<BookReadModel>>([]);
  readonly errorMessage = signal("");
  readonly relatedError = signal(false);
  readonly isLoggedIn = toSignal(this.store.select(selectLoginState), {
    initialValue: false,
  });

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => this.parseBookId(params.get("id"))),
        distinctUntilChanged(),
        switchMap((id) => {
          if (id === null) {
            this.status.set("notFound");
            this.book.set(null);
            this.relatedBooks.set([]);
            return EMPTY;
          }

          return this.reload$.pipe(
            startWith(undefined),
            switchMap(() => this.loadBook(id))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(({ book, relatedBooks }) => {
        this.book.set(book);
        this.relatedBooks.set(relatedBooks);
        this.status.set("success");
      });
  }

  retry(): void {
    this.reload$.next();
  }

  authorText(book: BookReadModel): string {
    return book.authorNames.length
      ? book.authorNames.join(", ")
      : "Unknown Author";
  }

  addToCart(book: BookReadModel): void {
    if (!this.isLoggedIn()) {
      this.snackBar.open(
        "Please sign in before adding books to your cart",
        "Close",
        { duration: 3000 }
      );
      void this.router.navigate(["/login"]);
      return;
    }

    const cartItem: CartCreateModel = { bookId: book.id, quantity: 1 };
    this.store.dispatch(CartActions.addCartItem({ cartItem }));
    this.snackBar.open(`"${book.title}" added to cart`, "Close", {
      duration: 2500,
    });
  }

  private loadBook(id: number) {
    this.status.set("loading");
    this.book.set(null);
    this.relatedBooks.set([]);
    this.errorMessage.set("");
    this.relatedError.set(false);

    return this.publicBookService.getBookById(id).pipe(
      switchMap((book) =>
        this.publicBookService.getRelatedBooks(id).pipe(
          map((relatedBooks): BookDetailResult => ({ book, relatedBooks })),
          catchError(() => {
            this.relatedError.set(true);
            return of({ book, relatedBooks: [] } satisfies BookDetailResult);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.status.set("notFound");
        } else {
          this.status.set("error");
          this.errorMessage.set(
            error.error?.message ?? error.message ?? "Please try again."
          );
        }
        return EMPTY;
      }),
      finalize(() => {
        if (this.status() === "loading") {
          this.status.set("error");
          this.errorMessage.set("The request ended before the book was loaded.");
        }
      })
    );
  }

  private parseBookId(value: string | null): number | null {
    if (value === null || !/^[1-9]\d*$/.test(value)) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
  }
}
