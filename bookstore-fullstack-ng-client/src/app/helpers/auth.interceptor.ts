import { HttpInterceptorFn } from "@angular/common/http";
import { tokenKey } from "../utils/token.utils";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // console.log(req.urlWithParams);
  const token = localStorage.getItem(tokenKey);
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(authReq);
};
