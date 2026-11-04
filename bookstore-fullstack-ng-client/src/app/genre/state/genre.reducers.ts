import { HttpErrorResponse } from "@angular/common/http";
import { GenreModel } from "../data/genre.model";
import { createReducer, on } from "@ngrx/store";
import { GenreActions } from "./genre.actions";

export const genreFeatureKey = "genre";

export interface GenreState {
  genres: GenreModel[];
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: GenreState = {
  genres: [],
  loading: false,
  error: null,
};

export const genreReducers = createReducer(
  initialState,
  on(GenreActions.loadGenre, (state) => ({
    ...state,
    loading: true,
  })),

  on(GenreActions.loadGenreSuccess, (state, { genres }) => ({
    ...state,
    loading: false,
    genres,
  })),
  on(GenreActions.loadGenreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GenreActions.addGenre, (state, { genre }) => ({
    ...state,
    loading: true,
  })),
  on(GenreActions.addGenreSuccess, (state, { genre }) => ({
    ...state,
    loading: false,
    genres: [...state.genres, genre],
  })),
  on(GenreActions.addGenreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GenreActions.updateGenre, (state, { genre }) => ({
    ...state,
    loading: true,
  })),
  on(GenreActions.updateGenreSuccess, (state, { genre }) => {
    if (!genre) {
      return state;
    }
    const updatedGenres = state.genres.map((a) =>
      a.id == genre.id ? genre : a
    );
    return {
      ...state,
      loading: false,
      genres: updatedGenres,
    };
  }),
  on(GenreActions.updateGenreFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GenreActions.deleteGenre, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(GenreActions.deleteGenreSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    genres: state.genres.filter((a) => a.id != id),
  }))
);
