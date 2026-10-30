import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoginState } from "../account/state/account.selectors";
import { tap } from "rxjs";

export const routeGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const isLoggedIn$ = store.select(selectLoginState);
  isLoggedIn$
    .pipe(
      tap((isLoggedIn) => {
        if (!isLoggedIn) {
          router.navigate(["/login"]);
        }
      })
    )
    .subscribe();
  return true;
  return true;
};
