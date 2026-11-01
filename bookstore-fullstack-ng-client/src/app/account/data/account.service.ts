import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { RegistrationModel } from "./registration.model";
import { HttpClient } from "@angular/common/http";
import { LoginModel } from "./login.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AccountService {
  private readonly baseUrl = environment.baseUrl + "/api/account";
  private readonly http = inject(HttpClient);

  /**
   * Registers a new user.
   *
   * @param data The user registration data.
   *
   * @returns The registered user.
   */
  registration(data: RegistrationModel): Observable<RegistrationModel> {
    return this.http.post<RegistrationModel>(this.baseUrl + "/signup", data);
  }

  // this method returns token
  login(data: LoginModel): Observable<string> {
    return this.http.post(this.baseUrl + "/login", data, {
      responseType: "text",
    });
  }
}
