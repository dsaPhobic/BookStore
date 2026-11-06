import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { BookReadModel } from "../Data/book-read.model";
import { HttpErrorResponse } from "@angular/common/http";
import { BookCreateModel } from "../Data/book-create.model";

export const BookActions = createActionGroup({
  source: "Book",
  events: {
    loadBooks: emptyProps(),
    loadBooksSuccess: props<{ books: readonly BookReadModel[] }>(),
    loadBookFailure: props<{ error: HttpErrorResponse }>(),
    addBook: props<{ book: BookCreateModel }>(),
    addBookSucces: props<{ book: BookReadModel }>(),
    addBookFailure: props<{ error: HttpErrorResponse }>(),
    updateBook: props<{ book: BookCreateModel }>(),
    updateBookSuccess: props<{ book: BookReadModel }>(),
    updateBookFailure: props<{ error: HttpErrorResponse }>(),
    deleteBook: props<{ id: number }>(),
    deleteBookSuccess: props<{ id: number }>(),
    deleteBookFailure: props<{ error: HttpErrorResponse }>(),
    "set current page": props<{ page: number }>(),
    "set page size": props<{ pageSize: number }>(),
    "set total count": props<{ totalCount: number }>(),
    "set search term": props<{ searchTerm: string | null }>(),
    "set sort by": props<{ sortBy: string }>(),
    setGenreIds: props<{ genreIds: Array<number> }>(),
    setPublishedFrom: props<{ publishedFrom: number | null }>(),
    setPublishedTo: props<{ publishedTo: number | null }>(),
  },
});
