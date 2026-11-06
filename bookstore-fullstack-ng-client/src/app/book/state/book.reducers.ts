import { HttpErrorResponse } from "@angular/common/http";
import { BookReadModel } from "../Data/book-read.model";
import { createReducer, on } from "@ngrx/store";
import { BookActions } from "./book.actions";

export const bookFeatureKey = "book";

export interface BookState {
  books: ReadonlyArray<BookReadModel>;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  searchTerm: string | null;
  sortBy: string;
  genreIds: Array<number>;
  publishedFrom: number | null;
  publishedTo: number | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: BookState = {
  books: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
  searchTerm: "",
  genreIds: [],
  sortBy: "",
  publishedFrom: null,
  publishedTo: null,
  loading: false,
  error: null,
};

export const bookReducer = createReducer(
  initialState,
  on(BookActions.loadBooks, (state) => ({ ...state, loading: true })),
  on(BookActions.loadBooksSuccess, (state, { books }) => ({
    ...state,
    books,
    loading: false,
  })),
  on(BookActions.loadBookFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(BookActions.addBook, (state, { book }) => ({
    ...state,
    loading: false,
  })),
  on(BookActions.addBookSucces, (state, { book }) => {
    const newState = {
      ...state,
      books: [...state.books, book],
      loading: false,
    };
    return newState;
  }),
  on(BookActions.addBookFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(BookActions.updateBook, (state, { book }) => ({
    ...state,
    loading: false,
  })),
  on(BookActions.updateBookSuccess, (state, { book }) => ({
    ...state,
    books: state.books.map((b) => (b.id == book.id ? book : b)),
    loading: false,
  })),
  on(BookActions.updateBookFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(BookActions.deleteBook, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(BookActions.deleteBookSuccess, (state, { id }) => ({
    ...state,
    state: state.books.filter((a) => a.id != id),
    loading: false,
  })),
  on(BookActions.setPublishedFrom, (state, { publishedFrom }) => ({
    ...state,
    publishedFrom,
  })),
  on(BookActions.setPublishedTo, (state, { publishedTo }) => ({
    ...state,
    publishedTo,
  })),
  on(BookActions.setCurrentPage, (state, { page }) => {
    return {
      ...state,
      pageNumber: page,
    };
  }),
  on(BookActions.setPageSize, (state, { pageSize }) => {
    return {
      ...state,
      pageSize,
    };
  }),
  on(BookActions.setTotalCount, (state, { totalCount }) => {
    return {
      ...state,
      totalCount,
    };
  }),
  on(BookActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(BookActions.setGenreIds, (state, { genreIds }) => ({
    ...state,
    genreIds,
  })),
  on(BookActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
  }))
);
