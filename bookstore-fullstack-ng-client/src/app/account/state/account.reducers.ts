import { HttpErrorResponse } from "@angular/common/http";
import { createReducer, on } from "@ngrx/store";
import accountActions from "./account.actions";

export const accountFeatureKey = "Account";

export interface AccountState {
  token: string | null;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: AccountState = {
  token: null,
  loading: false,
  error: null,
};

export const accountReducers = createReducer(
  initialState,
  on(accountActions.login, (state, { login }) => ({
    ...state,
    loading: true,
  })),
  on(accountActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: false,
  })),
  on(accountActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(accountActions.loadAccountInfo, (state, { accessToken }) => ({
    ...state,
    token: accessToken,
  })),
  on(accountActions.logout, (state) => ({
    ...state,
    loading: true,
  })),
  on(accountActions.logoutSuccess, (state) => ({
    ...state,
    loading: false,
    token: null,
  })),
  on(accountActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
