import { createAction, props } from "@ngrx/store";
import { LoginModel } from "../data/login.model";
import { HttpErrorResponse } from "@angular/common/http";

const login = createAction("[Account] Login", props<{ login: LoginModel }>());

const loginSuccess = createAction(
  "[Account] Login Success",
  props<{ token: string }>()
);

const loginFailure = createAction(
  "[Account] Login Failure",
  props<{ error: HttpErrorResponse | null }>()
);

const loadAccountInfo = createAction(
  "[Auth] Load Account Info",
  props<{ accessToken: string }>()
);

const logout = createAction("[Account] Logout");

const logoutSuccess = createAction("[Account] Logout Success");

const logoutFailure = createAction(
  "[Account] Logout Failure",
  props<{ error: HttpErrorResponse }>()
);

const accountActions = {
  login,
  loginSuccess,
  loginFailure,
  loadAccountInfo,
  logout,
  logoutSuccess,
  logoutFailure,
};

export default accountActions;
