import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegistrationModel } from "../data/registration.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";
import { MustMatch } from "../../helpers/must-match.validator";
import { validPattern } from "../../helpers/pattern.validator";

@Component({
  selector: "app-registration-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    NgIf,
  ],
  template: `
    <div class="registration-form-container">
      <form [formGroup]="registrationForm" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-icon matPrefix>person_outline</mat-icon>
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched)"
          >
            <span *ngIf="f['name'].errors?.['required']">Name is required</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>mail_outline</mat-icon>
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" />
          <mat-error
            *ngIf="
              f['email'].invalid && (f['email'].dirty || f['email'].touched)
            "
          >
            <span *ngIf="f['email'].errors?.['required']"
              >Email is required</span
            >
            <span *ngIf="f['email'].errors?.['email']">Invalid Email</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>lock_outline</mat-icon>
          <mat-label>Password</mat-label>
          <input type="password" matInput formControlName="password" />
          <mat-error
            *ngIf="
              f['password'].invalid &&
              (f['password'].dirty || f['password'].touched)
            "
          >
            <span *ngIf="f['password'].errors?.['required']">
              Password is required
            </span>
            <span *ngIf="f['password'].errors?.['invalidPattern']">
              Min 6 chars with uppercase, lowercase, number, and symbol
            </span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>verified_user</mat-icon>
          <mat-label>Confirm Password</mat-label>
          <input type="password" matInput formControlName="passwordConfirm" />
          <mat-error
            *ngIf="
              f['passwordConfirm'].invalid &&
              (f['passwordConfirm'].dirty || f['passwordConfirm'].touched)
            "
          >
            <span *ngIf="f['passwordConfirm'].errors?.['required']">
              Password confirm is required
            </span>
            <span *ngIf="f['passwordConfirm'].errors?.['mustMatch']">
              Passwords must match
            </span>
          </mat-error>
        </mat-form-field>

        <button
          [disabled]="registrationForm.invalid"
          mat-flat-button
          color="primary"
          class="submit-btn"
        >
          <mat-icon>person_add</mat-icon>
          Create Account
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      form {
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
        margin-top: 6px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationFormComponet {
  @Output() submitData = new EventEmitter<RegistrationModel>();
  fb = inject(FormBuilder);

  patternRegex = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$"
  );
  registrationForm = this.fb.group(
    {
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, validPattern(this.patternRegex)]],
      passwordConfirm: ["", Validators.required],
    },
    {
      validator: MustMatch("password", "passwordConfirm"),
    }
  );

  get f() {
    return this.registrationForm.controls;
  }

  submit() {
    var registrationData: RegistrationModel = Object.assign(
      this.registrationForm.value
    );
    this.submitData.emit(registrationData);
    this.registrationForm.reset();
  }
}
