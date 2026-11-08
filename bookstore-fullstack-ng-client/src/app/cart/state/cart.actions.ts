import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { CartItem } from "../data/cart-read.model";
import { HttpErrorResponse } from "@angular/common/http";
import { CartCreateModel } from "../data/cart-create.model";
import { CartUpdateModel } from "../data/cart-update.model";

export const CartActions = createActionGroup({
  source: "Cart",
  events: {
    "Load cart items": emptyProps(),
    "Load cart items success": props<{ cartItems: ReadonlyArray<CartItem> }>(),
    "Load cart items failure": props<{ error: HttpErrorResponse }>(),
    "Add cart item": props<{ cartItem: CartCreateModel }>(),
    "Add cart item success": props<{ cartItem: CartItem }>(),
    "Add cart item failure": props<{ error: HttpErrorResponse }>(),
    "Update cart item": props<{ cartItem: CartUpdateModel }>(),
    "Update cart item success": props<{ cartItem: CartItem }>(),
    "Update cart item failure": props<{ error: HttpErrorResponse }>(),
    "Delete cart item": props<{ id: number }>(),
    "Delete cart item success": props<{ id: number }>(),
    "Delete cart item failure": props<{ error: HttpErrorResponse }>(),
    "Empty Cart Item State": emptyProps(),
  },
});
