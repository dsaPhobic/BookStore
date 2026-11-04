import { HttpErrorResponse } from "@angular/common/http";
import { Author } from "../data/author.model";
import { authorActions } from "./author.actions";
import { createReducer, on } from "@ngrx/store";

export const authorFeaturKey = "author";

export interface AuthorState {
  authors: ReadonlyArray<Author>;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  searchTerm: string | null;
  sortBy: string;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: AuthorState = {
  authors: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
  searchTerm: "",
  sortBy: "",
  loading: false,
  error: null,
};

export const authorReducers = createReducer(
  initialState,
  on(authorActions.loadAuthors, (state) => ({
    ...state,
    loading: true,
  })),
  on(authorActions.loadAuthorsSuccess, (state, { authors }) => ({
    ...state,
    loading: false,
    authors,
  })),
  on(authorActions.loadAuthorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authorActions.addAuthor, (state, { author }) => ({
    ...state,
    loading: true,
  })),
  on(authorActions.addAuthorSuccess, (state, { author }) => ({
    ...state,
    loading: false,
    authors: [...state.authors, author],
  })),
  on(authorActions.addAuthorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authorActions.updateAuthor, (state, { author }) => ({
    ...state,
    loading: true,
  })),
  on(authorActions.updateAuthorSuccess, (state, { author }) => ({
    ...state,
    loading: false,
    authors: state.authors.map((au) => (au.id === author.id ? author : au)),
  })),
  on(authorActions.updateAuthorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authorActions.deleteAuthor, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(authorActions.deleteAuthorSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    authors: state.authors.filter((au) => au.id !== id),
  })),
  on(authorActions.deleteAuthorFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(authorActions.setCurrentPage, (state, { page }) => {
    //console.log("page number from dispatch: " + page); // working and able to log value
    return {
      ...state,
      pageNumber: page,
    };
  }),
  on(authorActions.setPageSize, (state, { pageSize }) => {
    //console.log("page size(limit) from dispatch: " + pageSize); //working and able to log value

    return {
      ...state,
      pageSize,
    };
  }),
  on(authorActions.setTotalCount, (state, { totalCount }) => {
    //console.log("page size(limit) from dispatch: " + pageSize); //working and able to log value

    return {
      ...state,
      totalCount,
    };
  }),
  on(authorActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
  on(authorActions.setSortBy, (state, { sortBy }) => ({
    ...state,
    sortBy,
  }))
);
