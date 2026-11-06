import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { BookService } from "../Data/book.service";
import { catchError, map, of, switchMap } from "rxjs";
import { concatLatestFrom } from "@ngrx/operators";
import { BookActions } from "./book.actions";
import { selectBookState } from "./book.selectors";

@Injectable()
export class BookEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  bookService = inject(BookService);

  loadBooks = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.loadBooks),
      concatLatestFrom(() => [this.store.select(selectBookState)]),
      switchMap(([action, state]) =>
        this.bookService
          .getBooks({
            pageSize: state.pageSize,
            pageNumber: state.pageNumber,
            searchTerm: state.searchTerm ?? "",
            sortBy: state.sortBy,
            genreIds: state.genreIds,
            publishedFrom: state.publishedFrom,
            publishedTo: state.publishedTo,
          })
          .pipe(
            switchMap((data) => {
              return [
                BookActions.loadBooksSuccess({ books: data.items }),
                BookActions.setTotalCount({ totalCount: data.totalCount }),
              ];
            }),
            catchError((error) => of(BookActions.loadBookFailure({ error })))
          )
      )
    )
  );

  addBook = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.addBook),
      switchMap((action) =>
        this.bookService.addBook(action.book).pipe(
          map((book) => {
            return BookActions.addBookSucces({ book });
          }),
          catchError((error) => of(BookActions.addBookFailure({ error })))
        )
      )
    )
  );

  updateBook = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.updateBook),
      switchMap((action) => {
        return this.bookService.updateBook(action.book).pipe(
          map((book) => BookActions.updateBookSuccess({ book })),
          catchError((error) => of(BookActions.updateBookFailure({ error })))
        );
      })
    )
  );

  deleteBook = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.deleteBook),
      switchMap((action) =>
        this.bookService.deleteBook(action.id).pipe(
          map(() => BookActions.deleteBook({ id: action.id })),
          catchError((error) => of(BookActions.deleteBookFailure({ error })))
        )
      )
    )
  );
}
