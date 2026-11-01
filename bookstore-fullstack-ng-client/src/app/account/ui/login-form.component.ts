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
import { LoginModel } from "../data/login.model";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-login-form",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
  ],
  template: `
    <form
      class="login-form"
      [formGroup]="loginForm"
      (ngSubmit)="onSubmit($event)"
    >
      <mat-form-field appearance="fill">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" />
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

      <mat-form-field appearance="fill">
        <mat-label>Password</mat-label>
        <input type="password" matInput formControlName="password" />
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

      <div>
        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="loginForm.invalid"
        >
          Login
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 5px;
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
