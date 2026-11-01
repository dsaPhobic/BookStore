import { inject, Injectable } from "@angular/core";
import { AccountService } from "../data/account.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import accountActions from "./account.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { tokenKey } from "../../utils/token.utils";

@Injectable()
export class AccountEffects {
  private accountService = inject(AccountService);
  private actions$ = inject(Actions);

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
