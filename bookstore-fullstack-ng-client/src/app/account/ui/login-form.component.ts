import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { LoginModel } from "../data/login.model";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-login-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    NgIf,
    ReactiveFormsModule,
  ],
  template: `
    <form
      class="login-form"
      [formGroup]="loginForm"
      (ngSubmit)="onSubmit($event)"
    >
      <mat-form-field appearance="outline">
        <mat-icon matPrefix>mail_outline</mat-icon>
        <mat-label>Email / Username</mat-label>
        <input
          matInput
          formControlName="username"
          placeholder="admin@gmail.com"
        />
        <mat-error
          *ngIf="
            f['username'].invalid &&
            (f['username'].dirty || f['username'].touched)
          "
        >
          <span *ngIf="f['username'].errors?.['required']"
            >Username is required</span
          >
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-icon matPrefix>lock_outline</mat-icon>
        <mat-label>Password</mat-label>
        <input
          type="password"
          matInput
          formControlName="password"
          placeholder="••••••••"
        />
        <mat-error
          *ngIf="
            f['password'].invalid &&
            (f['password'].dirty || f['password'].touched)
          "
        >
          <span *ngIf="f['password'].errors?.['required']"
            >Password is required</span
          >
        </mat-error>
      </mat-form-field>

      <button
        type="submit"
        mat-flat-button
        color="primary"
        class="submit-btn"
        [disabled]="loginForm.invalid"
      >
        <mat-icon>login</mat-icon>
        Sign In
      </button>
    </form>
  `,
  styles: [
    `
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      mat-form-field {
        width: 100%;
      }

      .submit-btn {
        width: 100%;
        height: 46px !important;
        margin-top: 4px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponet {
  @Output() submit = new EventEmitter<LoginModel>();
  fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    this.submit.emit(this.loginForm.value);
    this.loginForm.reset();
  }

  resetLoginForm() {
    this.loginForm.reset();
  }
}
