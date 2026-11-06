import { createFeatureSelector, createSelector } from "@ngrx/store";
import { bookFeatureKey, BookState } from "./book.reducers";

export const selectBookState = createFeatureSelector<BookState>(bookFeatureKey);

export const selectBooks = createSelector(
  selectBookState,
  (state) => state.books
);

export const selectBookLoading = createSelector(
  selectBookState,
  (state) => state.loading
);

export const selectBookError = createSelector(
  selectBookState,
  (state) => state.error
);

export const selectBookTotalCount = createSelector(
  selectBookState,
  (state) => state.totalCount
);

export const selectBookCurrentPage = createSelector(
  selectBookState,
  (state) => state.pageNumber
);

export const selectBookPageSize = createSelector(
  selectBookState,
  (state) => state.pageSize
);

export const selectBookTotalPages = createSelector(
  selectBookState,
  (state) => state.totalPages
);

export const selectBookHasNext = createSelector(
  selectBookState,
  (state) => state.hasNext
);

export const selectBookHasPrevious = createSelector(
  selectBookState,
  (state) => state.hasPrevious
);
