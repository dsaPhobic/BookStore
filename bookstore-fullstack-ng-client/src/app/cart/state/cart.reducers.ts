import { HttpErrorResponse } from "@angular/common/http";
import { CartItem } from "../data/cart-read.model";
import { createReducer, on } from "@ngrx/store";
import { CartActions } from "./cart.actions";

export const cartFeatureKey = "cart";

export interface CartState {
  cartItems: ReadonlyArray<CartItem>;
  loading: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

export const cartReducers = createReducer(
  initialState,
  on(CartActions.loadCartItems, (state) => ({
    ...state,
    loading: true,
  })),
  on(CartActions.loadCartItemsSuccess, (state, { cartItems }) => ({
    ...state,
    cartItems,
    loading: false,
  })),
  on(CartActions.loadCartItemsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CartActions.addCartItem, (state, { cartItem }) => ({
    ...state,
    loading: true,
  })),
  on(CartActions.addCartItemSuccess, (state, { cartItem }) => ({
    ...state,
    cartItems: [...state.cartItems, cartItem],
    loading: false,
  })),
  on(CartActions.addCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CartActions.updateCartItem, (state, { cartItem }) => ({
    ...state,
    loading: true,
  })),
  on(CartActions.updateCartItemSuccess, (state, { cartItem }) => ({
    ...state,
    loading: false,
    cartItems: state.cartItems.map((item) =>
      item.id === cartItem.id ? cartItem : item
    ),
  })),
  on(CartActions.updateCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CartActions.deleteCartItem, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(CartActions.deleteCartItemSuccess, (state, { id }) => ({
    ...state,
    cartItems: state.cartItems.filter((item) => item.id !== id),
    loading: false,
  })),
  on(CartActions.deleteCartItemFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CartActions.emptyCartItemState, (state) => ({
    ...state,
    cartItems: [],
  }))
);
