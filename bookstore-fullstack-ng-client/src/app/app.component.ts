import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./header.component";
import { FooterComponent } from "./footer.component";
import { Store } from "@ngrx/store";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, of, Subject, takeUntil, tap } from "rxjs";
import {
  selectLoginState,
  selectTokenState,
  selectUserInfo,
} from "./account/state/account.selectors";
import accountActions from "./account/state/account.actions";
import { tokenUtils } from "./utils/token.utils";
import { AsyncPipe, NgIf } from "@angular/common";
import { CartActions } from "./cart/state/cart.actions";
import { selectCartCount } from "./cart/state/cart.selectors";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgIf, AsyncPipe],
  template: `
    <app-header
      (logout)="logout()"
      [cartCount]="(cartItemCount$ | async) ?? 0"
      [isLoggedIn]="(isLoggedIn$ | async) ?? false"
      [user]="userInfo$ | async"
    />

    <div class="content">
      <router-outlet />
    </div>
    <app-footer />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      .content {
        padding: 15px 20px;
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  store = inject(Store);
  snackBar = inject(MatSnackBar);
  destroyed$ = new Subject<boolean>();
  router = inject(Router);

  token$ = this.store.select(selectTokenState);
  isLoggedIn$ = this.store.select(selectLoginState);
  userInfo$ = this.store.select(selectUserInfo);

  cartItemCount$ = this.store.select(selectCartCount);
  logout() {
    this.store.dispatch(accountActions.logout());
    // clear cart Item state
    this.store.dispatch(CartActions.emptyCartItemState());

    this.snackBar.open("Successfully logged out", "Dismis", {
      duration: 1000,
    });
    this.router.navigate(["/login"]);
  }

  loadCartItems() {
    this.isLoggedIn$
      .pipe(
        tap((isLoggedIn) => {
          if (isLoggedIn) {
            this.store.dispatch(CartActions.loadCartItems());
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
  ngOnInit(): void {
    this.loadCartItems();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
