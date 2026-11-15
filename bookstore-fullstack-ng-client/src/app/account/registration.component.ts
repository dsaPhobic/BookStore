import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { RegistrationFormComponet } from "./ui/registration-form.component";
import { RegistrationModel } from "./data/registration.model";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";
import { AccountService } from "./data/account.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-registration",
  standalone: true,
  imports: [
    RegistrationFormComponet,
    NgIf,
    AsyncPipe,
    RouterModule,
    MatIconModule,
  ],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card surface-card">
        <div class="auth-header">
          <div class="auth-icon"><mat-icon>person_add</mat-icon></div>
          <h1>Create Your Account</h1>
          <p>Join BookStore to save your cart and track your orders.</p>
        </div>

        <ng-container *ngIf="message$ | async as message">
          <div class="message-banner" *ngIf="message">
            {{ message }}
          </div>
        </ng-container>

        <app-registration-form (submitData)="onFormSubmit($event)" />

        <div class="auth-footer">
          Already have an account?
          <a routerLink="/login">Sign in here</a>
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
        max-width: 460px;
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

      .message-banner {
        margin-bottom: 16px;
        padding: 10px 14px;
        border-radius: var(--bs-radius-sm);
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
        font-weight: 500;
        font-size: 13.5px;
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
export class RegistrationComponent implements OnDestroy, OnInit {
  message$ = new BehaviorSubject<string>("");
  destroyed$ = new Subject<boolean>();
  accoutService = inject(AccountService);

  onFormSubmit(registrationData: RegistrationModel) {
    this.message$.next("Creating account...");

    this.accoutService
      .registration(registrationData)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: () => {
          this.message$.next("Account created! You can now sign in.");
        },
        error: () => {
          this.message$.next("Could not register account. Please check inputs.");
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  ngOnInit(): void { }
}
