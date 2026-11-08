import { createFeatureSelector, createSelector } from "@ngrx/store";
import { cartFeatureKey, CartState } from "./cart.reducers";

export const selectCartState = createFeatureSelector<CartState>(cartFeatureKey);

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.cartItems
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);

export const selectCartCount = createSelector(
  selectCartState,
  (state) => state.cartItems.length
);
