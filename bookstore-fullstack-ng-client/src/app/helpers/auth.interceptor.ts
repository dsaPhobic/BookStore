import { HttpInterceptorFn } from "@angular/common/http";
import { tokenKey } from "../utils/token.utils";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(tokenKey);
  if (token && token.trim().length > 0) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }
  return next(req);
};
