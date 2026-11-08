import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { PaymentMethodModel } from "../data/payment-method.model";
import { OrderCreateModel } from "../data/order-create.model";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgFor, NgIf } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-create-order-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NgIf,
    NgFor,
    MatSelectModule,
  ],
  template: `
    <div class="order-form-container">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched)"
          >
            <span *ngIf="f['name'].errors?.['required']">Name is required</span>
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
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Mobile No.</mat-label>
          <input matInput formControlName="mobileNumber" />
          <mat-error
            *ngIf="
              f['mobileNumber'].invalid &&
              (f['mobileNumber'].dirty || f['mobileNumber'].touched)
            "
          >
            <span *ngIf="f['mobileNumber'].errors?.['required']"
              >Email is required</span
            >
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Payment method</mat-label>
          <mat-select formControlName="paymentMethod">
            <mat-option value="">Select Payment Method</mat-option>
            <mat-option *ngFor="let pm of paymentMethods" [value]="pm.value">{{
              pm.name
            }}</mat-option>
          </mat-select>
          <mat-error
            *ngIf="
              f['paymentMethod'].invalid &&
              (f['paymentMethod'].dirty || f['paymentMethod'].touched)
            "
          >
            <span *ngIf="f['paymentMethod'].errors?.['required']"
              >Email is required</span
            >
          </mat-error>
        </mat-form-field>

        <div class="btn-container">
          <button [disabled]="form.invalid" mat-raised-button color="primary">
            Checkout
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderFormComponent {
  @Input({ required: true }) paymentMethods!: ReadonlyArray<PaymentMethodModel>;
  @Output() onOrderSubmit = new EventEmitter<OrderCreateModel>();
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    mobileNumber: ["", Validators.required],
    paymentMethod: [0, Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    const orderData: OrderCreateModel = Object.assign(this.form.value);
    this.onOrderSubmit.emit(orderData);
    this.form.reset();
  }
}
