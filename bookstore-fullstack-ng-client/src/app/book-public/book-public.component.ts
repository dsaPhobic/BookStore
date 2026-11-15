import { AsyncPipe, NgIf } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  catchError,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  startWith,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import { selectLoginState } from "../account/state/account.selectors";
import { BookReadModel } from "../book/Data/book-read.model";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";
import { GenreActions } from "../genre/state/genre.actions";
import { selectGenres } from "../genre/state/genre.selectors";
import {
  PublicBookFilters,
  PublicBookPage,
  PublicBookQuery,
  PublicBookService,
} from "./data/public-book.service";
import { BookListPublicComponent } from "./ui/book-list-public.component";
import { BookPublicFilterComponent } from "./ui/book-public-filter.component";

const DEFAULT_QUERY: PublicBookQuery = {
  pageNumber: 1,
  pageSize: 12,
  searchTerm: "",
  sortBy: "",
  genreIds: [],
  publishedFrom: null,
  publishedTo: null,
  minPrice: null,
  maxPrice: null,
};

const ALLOWED_PAGE_SIZES = [12, 24, 48];
const ALLOWED_SORTS = new Set([
  "",
  "title desc",
  "price asc",
  "price desc",
  "publishedYear asc",
  "publishedYear desc",
]);

@Component({
  selector: "app-book-public",
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    BookListPublicComponent,
    BookPublicFilterComponent,
  ],
  template: `
    <div class="page-header">
      <div>
        <span class="eyebrow">STOREFRONT CATALOG</span>
        <h1>Explore All Books</h1>
        <p class="page-subtitle">
          Browse titles across software engineering, science, business, and
          classic literature.
        </p>
      </div>
    </div>

    <ng-container *ngIf="genres$ | async as genres">
      <app-book-public-filter
        [genres]="genres"
        [filters]="filters()"
        (filtersChange)="changeFilters($event)"
      />
    </ng-container>

    <div class="loading-center" *ngIf="loading()">
      <mat-spinner diameter="42"></mat-spinner>
    </div>

    <div class="surface-card error-state" *ngIf="errorMessage() as error">
      <mat-icon>error_outline</mat-icon>
      <div>
        <h3>Unable to load books</h3>
        <p>{{ error }}</p>
      </div>
      <button mat-stroked-button type="button" (click)="retry()">
        <mat-icon>refresh</mat-icon>
        Retry
      </button>
    </div>

    <ng-container *ngIf="!loading() && !errorMessage()">
      <ng-container *ngIf="page() as catalogPage">
        <div class="result-summary" *ngIf="catalogPage.totalCount > 0">
          {{ catalogPage.totalCount }}
          {{ catalogPage.totalCount === 1 ? "book" : "books" }} found
        </div>

        <app-book-list-public
          *ngIf="catalogPage.items.length > 0; else noBooksFound"
          [books]="catalogPage.items"
          (addToCart)="addToCart($event)"
        />

        <ng-template #noBooksFound>
          <div class="surface-card empty-state">
            <mat-icon>search_off</mat-icon>
            <h3>No matching books found</h3>
            <p>Try clearing your search or selecting different filters.</p>
          </div>
        </ng-template>

        <mat-paginator
          *ngIf="catalogPage.totalCount > 0"
          [length]="catalogPage.totalCount"
          [pageIndex]="catalogPage.pageNumber - 1"
          [pageSize]="catalogPage.pageSize"
          [pageSizeOptions]="pageSizeOptions"
          [showFirstLastButtons]="true"
          (page)="changePage($event)"
          aria-label="Select catalog page"
        />
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .result-summary {
        color: var(--bs-muted);
        font-size: 14px;
        margin: -8px 0 16px;
      }

      .error-state {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
      }

      .error-state > div {
        flex: 1;
      }

      .error-state h3,
      .error-state p {
        margin: 0;
      }

      mat-paginator {
        background: transparent;
        margin-top: 24px;
      }

      @media (max-width: 600px) {
        .error-state {
          align-items: flex-start;
          flex-wrap: wrap;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookPublicComponent {
  private readonly snackBar = inject(MatSnackBar);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicBookService = inject(PublicBookService);
  private readonly reload$ = new Subject<void>();

  readonly genres$ = this.store.select(selectGenres);
  readonly isLoggedIn = toSignal(this.store.select(selectLoginState), {
    initialValue: false,
  });
  readonly query = signal<PublicBookQuery>({ ...DEFAULT_QUERY });
  readonly page = signal<PublicBookPage | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly pageSizeOptions = ALLOWED_PAGE_SIZES;
  readonly filters = computed<PublicBookFilters>(() => {
    const query = this.query();
    return {
      searchTerm: query.searchTerm,
      sortBy: query.sortBy,
      genreIds: query.genreIds,
      publishedFrom: query.publishedFrom,
      publishedTo: query.publishedTo,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    };
  });

  constructor() {
    this.store.dispatch(GenreActions.loadGenre());

    this.route.queryParamMap
      .pipe(
        map((params) => this.readQuery(params)),
        distinctUntilChanged(
          (previous, current) =>
            JSON.stringify(previous) === JSON.stringify(current)
        ),
        tap((query) => this.query.set(query)),
        switchMap((query) =>
          this.reload$.pipe(
            startWith(undefined),
            switchMap(() => this.loadPage(query))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe((page) => this.page.set(page));
  }

  changeFilters(filters: PublicBookFilters): void {
    this.navigateWithQuery({
      ...this.query(),
      ...filters,
      pageNumber: 1,
    });
  }

  changePage(event: PageEvent): void {
    const current = this.query();
    const pageSizeChanged = event.pageSize !== current.pageSize;
    this.navigateWithQuery({
      ...current,
      pageNumber: pageSizeChanged ? 1 : event.pageIndex + 1,
      pageSize: event.pageSize,
    });
  }

  retry(): void {
    this.reload$.next();
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

  private loadPage(query: PublicBookQuery) {
    this.loading.set(true);
    this.errorMessage.set(null);

    return this.publicBookService.getBooks(query).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.error?.message ?? error.message ?? "Please try again."
        );
        return EMPTY;
      }),
      finalize(() => this.loading.set(false))
    );
  }

  private navigateWithQuery(query: PublicBookQuery): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.writeQuery(query),
    });
  }

  private readQuery(params: ParamMap): PublicBookQuery {
    const pageSize = this.readInteger(params.get("size"), DEFAULT_QUERY.pageSize);
    const sortBy = params.get("sort") ?? "";

    return {
      pageNumber: this.readInteger(params.get("page"), 1),
      pageSize: ALLOWED_PAGE_SIZES.includes(pageSize)
        ? pageSize
        : DEFAULT_QUERY.pageSize,
      searchTerm: params.get("q")?.trim() ?? "",
      sortBy: ALLOWED_SORTS.has(sortBy) ? sortBy : "",
      genreIds: [
        ...new Set(
          params
            .getAll("genre")
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0)
        ),
      ],
      publishedFrom: this.readOptionalNumber(params.get("yearFrom")),
      publishedTo: this.readOptionalNumber(params.get("yearTo")),
      minPrice: this.readOptionalNumber(params.get("minPrice")),
      maxPrice: this.readOptionalNumber(params.get("maxPrice")),
    };
  }

  private writeQuery(query: PublicBookQuery): Record<string, unknown> {
    return {
      q: query.searchTerm || null,
      genre: query.genreIds.length ? query.genreIds : null,
      sort: query.sortBy || null,
      yearFrom: query.publishedFrom,
      yearTo: query.publishedTo,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      page: query.pageNumber > 1 ? query.pageNumber : null,
      size: query.pageSize === DEFAULT_QUERY.pageSize ? null : query.pageSize,
    };
  }

  private readInteger(value: string | null, fallback: number): number {
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private readOptionalNumber(value: string | null): number | null {
    if (value === null || value.trim() === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }
}
