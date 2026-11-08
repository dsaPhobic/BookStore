import { inject, Injectable } from "@angular/core";
import { CartService } from "../data/cart.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CartActions } from "./cart.actions";
import { catchError, map, of, switchMap } from "rxjs";

@Injectable()
export class CartEffects {
  cartService = inject(CartService);
  actions$ = inject(Actions);

  loadCartItems = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCartItems),
      switchMap(() =>
        this.cartService.getUserCart().pipe(
          map((cart) =>
            CartActions.loadCartItemsSuccess({ cartItems: cart.cartItems })
          ),
          catchError((error) => {
            console.log(error);
            return of(CartActions.loadCartItemsFailure({ error }));
          })
        )
      )
    )
  );

  addCartItem = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addCartItem),
      switchMap(({ cartItem }) =>
        this.cartService.addCartItem(cartItem).pipe(
          map((cartItem) => CartActions.addCartItemSuccess({ cartItem })),
          catchError((error) => of(CartActions.addCartItemFailure({ error })))
        )
      )
    )
  );

  updateCartItem = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItem),
      switchMap(({ cartItem }) =>
        this.cartService.updateCartItem(cartItem).pipe(
          map((cartItem) => CartActions.updateCartItemSuccess({ cartItem })),
          catchError((error) =>
            of(CartActions.updateCartItemFailure({ error }))
          )
        )
      )
    )
  );

  deleteCartItem = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.deleteCartItem),
      switchMap(({ id }) =>
        this.cartService.deleteCart(id).pipe(
          map((cartItem) => CartActions.deleteCartItemSuccess({ id })),
          catchError((error) =>
            of(CartActions.updateCartItemFailure({ error }))
          )
        )
      )
    )
  );
}
