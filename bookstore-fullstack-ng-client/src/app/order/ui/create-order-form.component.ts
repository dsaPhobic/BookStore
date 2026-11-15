import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from "@angular/core";
import { PaymentMethodModel } from "../data/payment-method.model";
import { OrderCreateModel } from "../data/order-create.model";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CurrencyPipe, NgFor, NgIf } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { OrderService } from "../data/order.service";
import { CouponApplyResultModel } from "../data/coupon-apply-result.model";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-create-order-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
    NgIf,
    NgFor,
    CurrencyPipe,
    MatSelectModule,
  ],
  template: `
    <div class="checkout-card surface-card">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-icon matPrefix>person_outline</mat-icon>
          <mat-label>Recipient Full Name</mat-label>
          <input matInput formControlName="name" />
          <mat-error
            *ngIf="f['name'].invalid && (f['name'].dirty || f['name'].touched)"
          >
            <span *ngIf="f['name'].errors?.['required']">Name is required</span>
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>mail_outline</mat-icon>
          <mat-label>Email for Order Confirmation</mat-label>
          <input matInput formControlName="email" />
          <mat-error
            *ngIf="
              f['email'].invalid && (f['email'].dirty || f['email'].touched)
            "
          >
            <span *ngIf="f['email'].errors?.['required']"
              >Valid email is required</span
            >
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>phone</mat-icon>
          <mat-label>Mobile Number</mat-label>
          <input matInput formControlName="mobileNumber" />
          <mat-error
            *ngIf="
              f['mobileNumber'].invalid &&
              (f['mobileNumber'].dirty || f['mobileNumber'].touched)
            "
          >
            <span *ngIf="f['mobileNumber'].errors?.['required']"
              >Mobile number is required</span
            >
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-icon matPrefix>payments</mat-icon>
          <mat-label>Payment Method</mat-label>
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
              >Payment method is required</span
            >
          </mat-error>
        </mat-form-field>

        <div class="coupon-row">
          <mat-form-field appearance="outline">
            <mat-icon matPrefix>local_offer</mat-icon>
            <mat-label>Discount code</mat-label>
            <input
              matInput
              formControlName="couponCode"
              (input)="clearCouponResult()"
              [readonly]="couponApplying()"
            />
          </mat-form-field>
          <button
            mat-stroked-button
            type="button"
            (click)="applyCoupon()"
            [disabled]="couponApplying() || !f['couponCode'].value.trim()"
          >
            {{ couponApplying() ? "Checking..." : "Apply" }}
          </button>
        </div>
        <p class="coupon-message" *ngIf="couponResult() as result">
          {{ result.message }} You save
          {{ result.discountAmount | currency : "INR" }}.
          Estimated total: {{ result.total | currency : "INR" }}.
        </p>
        <p class="coupon-error" *ngIf="couponError() as error">{{ error }}</p>

        <div class="btn-row">
          <a mat-stroked-button routerLink="/cart">Back to Cart</a>
          <button
            [disabled]="form.invalid || couponApplying()"
            mat-flat-button
            color="accent"
            class="place-btn"
          >
            <mat-icon>check_circle</mat-icon>
            Place Order
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .checkout-card {
        max-width: 540px;
        padding: 28px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      mat-form-field {
        width: 100%;
      }

      .coupon-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .coupon-row button {
        min-width: 90px;
        height: 56px;
      }

      .coupon-message {
        color: var(--bs-success);
        margin: -4px 0 8px;
      }

      .coupon-error {
        color: var(--bs-danger, #b42318);
        margin: -4px 0 8px;
      }

      .btn-row {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 8px;
      }

      .place-btn {
        height: 44px !important;
        padding: 0 24px !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderFormComponent {
  @Input({ required: true }) paymentMethods!: ReadonlyArray<PaymentMethodModel>;
  @Output() onOrderSubmit = new EventEmitter<OrderCreateModel>();
  fb = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  couponApplying = signal(false);
  couponResult = signal<CouponApplyResultModel | null>(null);
  couponError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    mobileNumber: ["", Validators.required],
    paymentMethod: [0, [Validators.required, Validators.min(1)]],
    couponCode: [""],
  });

  get f() {
    return this.form.controls;
  }

  clearCouponResult() {
    this.couponResult.set(null);
    this.couponError.set(null);
  }

  applyCoupon() {
    const code = this.f["couponCode"].value?.trim();
    if (!code || this.couponApplying()) {
      return;
    }

    this.couponApplying.set(true);
    this.couponError.set(null);
    this.couponResult.set(null);
    this.orderService.applyCoupon(code).subscribe({
      next: (result) => {
        this.couponResult.set(result);
        this.couponApplying.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.couponResult.set(null);
        this.couponError.set(
          error.error?.message ?? "Could not apply this discount code."
        );
        this.couponApplying.set(false);
      },
    });
  }

  submit() {
    const orderData: OrderCreateModel = {
      ...this.form.getRawValue(),
      couponCode: this.couponResult()?.code,
    };
    this.onOrderSubmit.emit(orderData);
    this.form.reset();
  }
}
