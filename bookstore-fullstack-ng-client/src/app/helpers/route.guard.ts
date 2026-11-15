import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoginState } from "../account/state/account.selectors";
import { map, take } from "rxjs";
import { tokenUtils } from "../utils/token.utils";
import accountActions from "../account/state/account.actions";

export const routeGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const savedToken = tokenUtils.getToken();
  if (savedToken && !tokenUtils.isTokenExpired(savedToken)) {
    store.dispatch(accountActions.loadAccountInfo({ accessToken: savedToken }));
    return true;
  }

  return store.select(selectLoginState).pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(["/login"]);
        return false;
      }
      return true;
    })
  );
};
