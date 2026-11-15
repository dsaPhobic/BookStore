import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BookListComponent } from "./ui/book-list.component";
import { Store } from "@ngrx/store";
import { BookActions } from "./state/book.actions";
import {
  selectBooks,
  selectBookCurrentPage,
  selectBookPageSize,
  selectBookTotalCount,
} from "./state/book.selectors";
import { AsyncPipe, NgIf } from "@angular/common";
import { BookReadModel } from "./Data/book-read.model";
import { map, Observable, Subject, takeUntil } from "rxjs";
import { SortModel } from "../common/sort.model";
import { MatDialog } from "@angular/material/dialog";
import {
  selectAuthorError,
  selectAuthorLoading,
} from "../authors/state/author.selectors";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { BookDialogComponent } from "./ui/book-dialog.component";
import { AuthorService } from "../authors/data/author.service";
import { GenreService } from "../genre/data/genre.service";
import { GenreModel } from "../genre/data/genre.model";
import { Author } from "../authors/data/author.model";
import { PageSelectorModel } from "../common/page-selector.model";
import { BookPaginatorComponent } from "./ui/book-paginator.component";
import { BookFilterComponent } from "./ui/book-filter.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService } from "../common/confirmation.service";

const ADMIN_BOOK_PAGE_SIZES = [5, 10, 25, 50, 100];

@Component({
  selector: "app-book",
  standalone: true,
  imports: [
    BookListComponent,
    NgIf,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    BookPaginatorComponent,
    BookFilterComponent,
  ],
  template: `
    <div class="header-container">
      <div>
        <h1 class="page-title">Book & Library Management (PIM)</h1>
        <p class="subtitle">Manage your book inventory, optimize Cloudinary cover images, and auto-fill details via ISBN</p>
      </div>
      <button
        type="button"
        (click)="onAddUpdate('Add', null)"
        mat-raised-button
        color="primary"
      >
        <mat-icon>add</mat-icon> Add Book
      </button>
    </div>

    <mat-spinner *ngIf="loading$ | async"></mat-spinner>
    <ng-container *ngIf="error$ | async as error"> </ng-container>

    <app-book-filter
      (filter)="onFilter($event)"
      (publishFromEvent)="onPublishFrom($event)"
      (publishToEvent)="onPublishTo($event)"
    />

    <ng-container *ngIf="books$ | async as books">
      <app-book-list
        [books]="books"
        (sort)="onSort($event)"
        (delete)="onDelete($event)"
        (edit)="onAddUpdate('Edit', $event)"
      ></app-book-list>
    </ng-container>

    <ng-container *ngIf="totalCount$ | async as totalCount">
      <app-book-paginator
        (pageSelect)="onPageSelect($event)"
        [totalRecords]="totalCount"
        [currentPage]="(currentPage$ | async) ?? 1"
        [pageSize]="(pageSize$ | async) ?? 10"
      />
    </ng-container>
  `,
  styles: [
    `
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .page-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .subtitle {
        margin: 4px 0 0 0;
        color: #64748b;
        font-size: 13px;
      }
    `,
  ],
})
export class BookComponent implements OnInit, OnDestroy {
  authorService = inject(AuthorService);
  genreService = inject(GenreService);
  dialog = inject(MatDialog);
  private readonly confirmation = inject(ConfirmationService);
  destroyed$ = new Subject<boolean>();
  store = inject(Store);
  route = inject(ActivatedRoute);
  router = inject(Router);
  loading$ = this.store.select(selectAuthorLoading);
  error$ = this.store.select(selectAuthorError);
  totalCount$ = this.store.select(selectBookTotalCount);
  currentPage$ = this.store.select(selectBookCurrentPage);
  pageSize$ = this.store.select(selectBookPageSize);

  authors$: Observable<Author[]> = this.authorService
    .getAuthors({ pageSize: 1000 })
    .pipe(
      map((pl) => pl.items),
      takeUntil(this.destroyed$)
    );

  genres$: Observable<GenreModel[]> = this.genreService
    .getGenres()
    .pipe(takeUntil(this.destroyed$));

  books$: Observable<ReadonlyArray<BookReadModel>> =
    this.store.select(selectBooks);

  loadBooks() {
    this.store.dispatch(BookActions.loadBooks());
  }

  onSort(sort: SortModel) {
    this.store.dispatch(
      BookActions.setSortBy({
        sortBy: `${sort.sortColumn} ${sort.sortDirection}`,
      })
    );
    this.loadBooks();
  }

  onAddUpdate(action: string, book: BookReadModel | null = null) {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: {
        book,
        title: action + " Book",
        genres$: this.genres$,
        authors$: this.authors$,
      },
      width: "820px",
    });

    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedBook) => {
        if (!submittedBook) return;
        if (submittedBook.id) {
          this.store.dispatch(BookActions.updateBook({ book: submittedBook }));
        } else {
          this.store.dispatch(BookActions.addBook({ book: submittedBook }));
        }
        dialogRef.componentInstance.bookForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  onDelete(book: BookReadModel) {
    this.confirmation
      .confirm({
        title: "Delete book?",
        message: `Are you sure you want to delete the book "${book.title}"?`,
        confirmText: "Delete book",
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(BookActions.deleteBook({ id: book.id }));
          this.loadBooks();
        }
      });
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroyed$))
      .subscribe((params) => {
        const page = this.readPositiveInteger(params.get("page"), 1);
        const requestedSize = this.readPositiveInteger(params.get("size"), 10);
        const pageSize = ADMIN_BOOK_PAGE_SIZES.includes(requestedSize)
          ? requestedSize
          : 10;

        this.store.dispatch(BookActions.setCurrentPage({ page }));
        this.store.dispatch(BookActions.setPageSize({ pageSize }));
        this.loadBooks();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  onPageSelect(page: PageSelectorModel) {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page.page > 1 ? page.page : null,
        size: page.limit === 10 ? null : page.limit,
      },
      queryParamsHandling: "merge",
    });
  }

  onPublishFrom(publishedFrom: number | null) {
    this.store.dispatch(BookActions.setPublishedFrom({ publishedFrom }));
    this.loadBooks();
  }

  onPublishTo(publishedTo: number | null) {
    this.store.dispatch(BookActions.setPublishedTo({ publishedTo }));
    this.loadBooks();
  }

  onFilter(searchTerm: string | null) {
    this.store.dispatch(BookActions.setSearchTerm({ searchTerm }));
    this.loadBooks();
  }

  private readPositiveInteger(value: string | null, fallback: number): number {
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }
}
