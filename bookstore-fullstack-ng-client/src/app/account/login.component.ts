import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { LoginFormComponet } from "./ui/login-form.component";
import { LoginModel } from "./data/login.model";
import { Store } from "@ngrx/store";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AsyncPipe, NgIf } from "@angular/common";
import { Router } from "@angular/router";
import {
  selectLoginErrorState,
  selectLoginLoadingState,
  selectUserInfo,
} from "./state/account.selectors";
import { Subject, takeUntil, tap } from "rxjs";
import accountActions from "./state/account.actions";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    LoginFormComponet,
    NgIf,
    AsyncPipe,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="container">
      <h2>Login</h2>
      <div style="margin-bottom: 8px;"></div>
      <app-login-form (submit)="onSubmit($event)" />
    </div>
  `,
  styles: `
  .container{
    width:40%;
    display:flex;
    flex-direction:column;
    margin: auto;
    border:1px solid grey;
    padding:10px;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnDestroy {
  store = inject(Store);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  destroyed$ = new Subject<boolean>();
  @ViewChild(LoginFormComponet, { static: true })
  loginFormComponent!: LoginFormComponet;

  loading$ = this.store.select(selectLoginLoadingState);
  userInfo$ = this.store.select(selectUserInfo);

  error$ = this.store
    .select(selectLoginErrorState)
    .pipe(
      tap((d) => {
        if (d?.message) {
          this.loginFormComponent.resetLoginForm();
          this.matSnackBar.open(d?.message, "dismiss", {
            duration: 1000,
          });
        }
      }),
      takeUntil(this.destroyed$)
    )
    .subscribe();

  // later on, combine it with cart selector, and load cart here along with login
  doLogin$ = this.userInfo$.pipe(
    tap((userInfo) => {
      if (userInfo) {
        const { username } = userInfo;
        if (username) {
          this.matSnackBar.open("Login successful", "dismiss", {
            duration: 1000,
          });
          this.router.navigate(["/dashboard"]);
        }
      }
    }),
    takeUntil(this.destroyed$)
  );

  onSubmit(data: LoginModel) {
    this.store.dispatch(accountActions.login({ login: data }));
    this.doLogin$.subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
