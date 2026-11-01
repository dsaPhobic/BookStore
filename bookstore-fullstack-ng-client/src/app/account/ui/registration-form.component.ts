import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegistrationModel } from "../data/registration.model";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
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
    NgIf,
  ],
  template: `
    <div class="registration-form-container">
      <form [formGroup]="registrationForm" (ngSubmit)="submit()">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched)"
          >
            <span *ngIf="f['name'].errors?.['required']">
              Name is required
            </span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
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

        <mat-form-field appearance="fill">
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
              Password should be atleast 6 character long, contains atleas 1
              uppercase,1 lowercase,1 number,1 speacial character
            </span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Password Confirm</mat-label>
          <input type="password" matInput formControlName="passwordConfirm" />
        </mat-form-field>
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
            Password and password confirm must match
          </span>
        </mat-error>

        <div class="btn-container">
          <button
            [disabled]="registrationForm.invalid"
            mat-raised-button
            color="primary"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .registration-form-container {
        width: 100%;
        height: 100%;
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
  ); // must contain 6 letters, 1 uppercase, 1 lowercase, 1 number and 1 special character
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
