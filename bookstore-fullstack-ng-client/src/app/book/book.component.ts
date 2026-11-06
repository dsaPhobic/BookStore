import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BookListComponent } from "./ui/book-list.component";
import { Store } from "@ngrx/store";
import { BookActions } from "./state/book.actions";
import { selectBooks, selectBookTotalCount } from "./state/book.selectors";
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
import { BookDialogComponent } from "./ui/book-dialog.component";
import { AuthorService } from "../authors/data/author.service";
import { GenreService } from "../genre/data/genre.service";
import { GenreModel } from "../genre/data/genre.model";
import { Author } from "../authors/data/author.model";
import { PageSelectorModel } from "../common/page-selector.model";
import { BookPaginatorComponent } from "./ui/book-paginator.component";
import { BookFilterComponent } from "./ui/book-filter.component";

@Component({
  selector: "app-book",
  standalone: true,
  imports: [
    BookListComponent,
    NgIf,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatButtonModule,
    BookPaginatorComponent,
    BookFilterComponent,
  ],
  template: `
    <h1>Books</h1>
    <mat-spinner *ngIf="loading$ | async"></mat-spinner>
    <ng-container *ngIf="error$ | async as error"> </ng-container>
    <p>
      <button
        type="button"
        (click)="onAddUpdate('Add', null)"
        mat-raised-button
        color="accent"
      >
        +
      </button>
    </p>
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
        (edit)="onAddUpdate('Update', $event)"
      ></app-book-list>
    </ng-container>

    <ng-container *ngIf="totalCount$ | async as totalCount">
      <app-book-paginator
        (pageSelect)="onPageSelect($event)"
        [totalRecords]="totalCount"
      />
    </ng-container>
  `,

  styles: [``],
})
export class BookComponent implements OnInit, OnDestroy {
  authorService = inject(AuthorService);
  genreService = inject(GenreService);
  dialog = inject(MatDialog);
  destroyed$ = new Subject<boolean>();
  store = inject(Store);
  loading$ = this.store.select(selectAuthorLoading);
  error$ = this.store.select(selectAuthorError);
  totalCount$ = this.store.select(selectBookTotalCount);

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
    });
    dialogRef.componentInstance.submit
      .pipe(takeUntil(this.destroyed$))
      .subscribe((submittedBook) => {
        if (!submittedBook) return;
        if (submittedBook.id) {
          // update book
          this.store.dispatch(BookActions.updateBook({ book: submittedBook }));
        } else {
          this.store.dispatch(BookActions.addBook({ book: submittedBook }));
        }
        dialogRef.componentInstance.bookForm.reset();
        dialogRef.componentInstance.onCanceled();
      });
  }

  onDelete(book: BookReadModel) {
    if (
      window.confirm(`Are you sure to delete the record (book: ${book.title})?`)
    ) {
      this.store.dispatch(BookActions.deleteBook({ id: book.id }));
      this.loadBooks();
    }
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  onPageSelect(page: PageSelectorModel) {
    this.store.dispatch(BookActions.setCurrentPage({ page: page.page }));
    this.store.dispatch(BookActions.setPageSize({ pageSize: page.limit }));
    this.loadBooks();
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
}
