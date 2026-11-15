import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { LoginFormComponet } from "./ui/login-form.component";
import { LoginModel } from "./data/login.model";
import { Store } from "@ngrx/store";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { AsyncPipe, NgIf } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import {
  selectLoginErrorState,
  selectLoginLoadingState,
  selectUserInfo,
} from "./state/account.selectors";
import { Subject, takeUntil, tap } from "rxjs";
import accountActions from "./state/account.actions";
import { tokenUtils } from "../utils/token.utils";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    LoginFormComponet,
    NgIf,
    AsyncPipe,
    RouterModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card surface-card">
        <div class="auth-header">
          <div class="auth-icon"><mat-icon>auto_stories</mat-icon></div>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your cart, orders, or book catalog.</p>
        </div>

        <app-login-form (submit)="onSubmit($event)" />

        <div class="demo-box">
          <strong>Demo Admin Credentials:</strong>
          <span>Email: <code>admin&#64;gmail.com</code></span>
          <span>Password: <code>Admin&#64;123</code></span>
        </div>

        <div class="auth-footer">
          Don't have an account?
          <a routerLink="/signup">Create one for free</a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrapper {
        display: flex;
        justify-content: center;
        padding: 24px 0;
      }

      .auth-card {
        width: 100%;
        max-width: 440px;
        padding: 36px 32px;
      }

      .auth-header {
        text-align: center;
        margin-bottom: 24px;
      }

      .auth-icon {
        width: 44px;
        height: 44px;
        margin: 0 auto 14px;
        border-radius: var(--bs-radius-sm);
        background: var(--bs-ink);
        color: #fff;
        display: grid;
        place-items: center;
      }

      .auth-header h1 {
        font-family: var(--bs-font-sans);
        font-size: 24px;
        font-weight: 700;
        color: var(--bs-ink);
        margin: 0 0 6px;
        letter-spacing: -0.02em;
      }

      .auth-header p {
        margin: 0;
        color: var(--bs-muted);
        font-size: 14px;
      }

      .demo-box {
        margin-top: 20px;
        padding: 12px 16px;
        border-radius: var(--bs-radius-sm);
        background: var(--bs-surface-2);
        border: 1px dashed var(--bs-border);
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 13px;
        color: var(--bs-muted);
      }

      .demo-box strong {
        color: var(--bs-ink);
      }

      .auth-footer {
        margin-top: 20px;
        text-align: center;
        font-size: 14px;
        color: var(--bs-muted);
      }

      .auth-footer a {
        font-weight: 600;
        color: var(--bs-ink);
        text-decoration: underline;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
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
        if (!d) return;
        let errorMessage = "Login failed. Please check your email and password.";
        if (d.error) {
          try {
            const parsed = typeof d.error === "string" ? JSON.parse(d.error) : d.error;
            if (parsed?.Message) {
              errorMessage = parsed.Message;
            } else if (parsed?.message) {
              errorMessage = parsed.message;
            }
          } catch {
            if (typeof d.error === "string" && d.error.trim().length > 0) {
              errorMessage = d.error;
            }
          }
        } else if (d.status === 400 || d.status === 401) {
          errorMessage = "Incorrect email or password.";
        } else if (d.message) {
          errorMessage = d.message;
        }

        this.matSnackBar.open(errorMessage, "Dismiss", {
          duration: 3500,
        });
      }),
      takeUntil(this.destroyed$)
    )
    .subscribe();

  ngOnInit(): void {
    const savedToken = tokenUtils.getToken();
    if (savedToken && !tokenUtils.isTokenExpired(savedToken)) {
      this.router.navigate(["/dashboard"]);
    }
  }

  onSubmit(data: LoginModel) {
    this.store.dispatch(accountActions.login({ login: data }));
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
