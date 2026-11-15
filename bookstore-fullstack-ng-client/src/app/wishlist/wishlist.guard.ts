import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, take } from "rxjs";
import { selectLoginState } from "../account/state/account.selectors";
import accountActions from "../account/state/account.actions";
import { tokenUtils } from "../utils/token.utils";

export const wishlistGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const accessToken = tokenUtils.getToken();

  if (accessToken && !tokenUtils.isTokenExpired(accessToken)) {
    store.dispatch(accountActions.loadAccountInfo({ accessToken }));
    return true;
  }

  return store.select(selectLoginState).pipe(
    take(1),
    map((isLoggedIn) =>
      isLoggedIn ? true : router.createUrlTree(["/login"])
    )
  );
};
