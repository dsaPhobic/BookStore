import { createFeatureSelector, createSelector } from "@ngrx/store";
import { authorFeaturKey, AuthorState } from "./author.reducers";

export const selectAuthorState =
  createFeatureSelector<AuthorState>(authorFeaturKey);

export const selectAuthors = createSelector(
  selectAuthorState,
  (state) => state.authors
);

export const selectAuthorLoading = createSelector(
  selectAuthorState,
  (state) => state.loading
);

export const selectAuthorError = createSelector(
  selectAuthorState,
  (state) => state.error
);

export const selectAuthorTotalCount = createSelector(
  selectAuthorState,
  (state) => state.totalCount
);

export const selectAuthorCurrentPage = createSelector(
  selectAuthorState,
  (state) => state.pageNumber
);

export const selectAuthorPageSize = createSelector(
  selectAuthorState,
  (state) => state.pageSize
);

export const selectAuthorTotalPages = createSelector(
  selectAuthorState,
  (state) => state.totalPages
);

export const selectAuthorHasNext = createSelector(
  selectAuthorState,
  (state) => state.hasNext
);

export const selectAuthorHasPrevious = createSelector(
  selectAuthorState,
  (state) => state.hasPrevious
);
