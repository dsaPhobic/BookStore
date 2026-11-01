import { createFeatureSelector, createSelector } from "@ngrx/store";
import { accountFeatureKey, AccountState } from "./account.reducers";
import { tokenUtils } from "../../utils/token.utils";

export const selectAccountState =
  createFeatureSelector<AccountState>(accountFeatureKey);

export const selectTokenState = createSelector(
  selectAccountState,
  (state) => state.token
);

export const selectLoginState = createSelector(selectAccountState, (state) => {
  const accessToken = state.token;
  if (!accessToken) return false;
  const isExpired = tokenUtils.isTokenExpired(accessToken);
  return !isExpired;
});

export const selectUserInfo = createSelector(
  selectAccountState,
  selectLoginState,
  (state, isLoggedIn) => {
    if (!isLoggedIn) return null;
    const accessToken = state.token;
    if (!accessToken) return null;
    const userInfo = tokenUtils.getUserFromToken(accessToken);
    return userInfo;
  }
);

export const selectLoginLoadingState = createSelector(
  selectAccountState,
  (state) => state.loading
);

export const selectLoginErrorState = createSelector(
  selectAccountState,
  (state) => state.error
);
