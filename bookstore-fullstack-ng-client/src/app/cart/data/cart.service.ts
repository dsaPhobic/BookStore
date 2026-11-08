import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { CartCreateModel } from "./cart-create.model";
import { Observable } from "rxjs";
import { CartItem, CartReadModel } from "./cart-read.model";
import { HttpClient } from "@angular/common/http";
import { CartUpdateModel } from "./cart-update.model";

@Injectable({ providedIn: "root" })
export class CartService {
  private baseUrl = environment.baseUrl + "/api/carts";
  private http = inject(HttpClient);

  addCartItem(cartItem: CartCreateModel): Observable<CartItem> {
    return this.http.post<CartItem>(this.baseUrl, cartItem);
  }

  updateCartItem(cartItem: CartUpdateModel): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.baseUrl}/${cartItem.id}`, cartItem);
  }

  deleteCart(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getUserCart(): Observable<CartReadModel> {
    return this.http.get<CartReadModel>(`${this.baseUrl}/userCart`);
  }

  getAllCarts(): Observable<Array<CartReadModel>> {
    return this.http.get<Array<CartReadModel>>(this.baseUrl);
  }
}
