import { createFeatureSelector, createSelector } from "@ngrx/store";
import { genreFeatureKey, GenreState } from "./genre.reducers";

export const selectBookState =
  createFeatureSelector<GenreState>(genreFeatureKey);

export const selectGenres = createSelector(
  selectBookState,
  (state) => state.genres
);

export const selectGenreLoading = createSelector(
  selectBookState,
  (state) => state.loading
);

export const selectGenreError = createSelector(
  selectBookState,
  (state) => state.error
);
