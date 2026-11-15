import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import {
  selectLoginState,
  selectUserInfo,
} from "../account/state/account.selectors";
import { map, take } from "rxjs";
import { tokenUtils } from "../utils/token.utils";
import accountActions from "../account/state/account.actions";

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const { roles } = route.data;
  const requiredRoles: string[] = roles || [];

  // Check persisted token first
  const savedToken = tokenUtils.getToken();
  if (savedToken && !tokenUtils.isTokenExpired(savedToken)) {
    const user = tokenUtils.getUserFromToken(savedToken);
    if (user) {
      store.dispatch(accountActions.loadAccountInfo({ accessToken: savedToken }));
      const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );
      if (!hasRequiredRole) {
        router.navigate(["/unauthorized"]);
        return false;
      }
      return true;
    }
  }

  // Fallback to reactive store
  return store.select(selectUserInfo).pipe(
    take(1),
    map((userInfo) => {
      if (!userInfo) {
        router.navigate(["/login"]);
        return false;
      }
      const userRoles = Array.isArray(userInfo.roles)
        ? userInfo.roles
        : [userInfo.roles];
      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );
      if (!hasRequiredRole) {
        router.navigate(["/unauthorized"]);
        return false;
      }
      return true;
    })
  );
};
