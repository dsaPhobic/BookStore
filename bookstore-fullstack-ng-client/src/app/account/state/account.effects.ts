import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AccountService } from "../data/account.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import accountActions from "./account.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { tokenKey } from "../../utils/token.utils";

@Injectable()
export class AccountEffects {
  private accountService = inject(AccountService);
  private actions$ = inject(Actions);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  login = createEffect(() =>
    this.actions$.pipe(
      ofType(accountActions.login),
      switchMap((action) =>
        this.accountService.login(action.login).pipe(
          map((token) => {
            localStorage.setItem(tokenKey, token);
            return accountActions.loginSuccess({ token });
          }),
          catchError((error) => of(accountActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(accountActions.loginSuccess),
        tap(() => {
          this.snackBar.open("Login successful", "Dismiss", {
            duration: 2000,
          });
          this.router.navigate(["/dashboard"]);
        })
      ),
    { dispatch: false }
  );

  logout = createEffect(() =>
    this.actions$.pipe(
      ofType(accountActions.logout),
      map(() => {
        localStorage.removeItem(tokenKey);
        return accountActions.logoutSuccess();
      }),
      catchError((error) => of(accountActions.loginFailure(error)))
    )
  );
}
