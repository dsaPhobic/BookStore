import { CurrencyPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { finalize } from "rxjs";
import { CouponCreateModel, CouponModel } from "./data/coupon.model";
import { CouponService } from "./data/coupon.service";

@Component({
  selector: "app-coupons",
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <div class="page-header">
      <div>
        <span class="eyebrow">PROMOTIONS</span>
        <h1>Manage Coupons</h1>
        <p class="page-subtitle">Create discount codes and track their usage.</p>
      </div>
    </div>

    <section class="surface-card create-card">
      <h2>Create a coupon</h2>
      <form [formGroup]="form" (ngSubmit)="createCoupon()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Coupon code</mat-label>
            <input matInput formControlName="code" maxlength="50" placeholder="SAVE10" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Discount (%)</mat-label>
            <input matInput type="number" formControlName="discountPercent" min="0.01" max="100" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maximum discount (optional)</mat-label>
            <input matInput type="number" formControlName="maxDiscount" min="0.01" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Expires (optional)</mat-label>
            <input matInput type="datetime-local" formControlName="expiryDate" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Maximum uses (optional)</mat-label>
            <input matInput type="number" formControlName="maxUsageCount" min="1" />
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="isActive">Active</mat-checkbox>
        <div class="form-actions">
          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
          <button mat-flat-button color="accent" type="submit" [disabled]="form.invalid || saving">
            <mat-icon>add</mat-icon>
            {{ saving ? "Creating..." : "Create Coupon" }}
          </button>
        </div>
      </form>
    </section>

    <section class="surface-card list-card">
      <div class="list-heading">
        <h2>Coupons</h2>
        <button mat-stroked-button type="button" (click)="loadCoupons()" [disabled]="loading">
          <mat-icon>refresh</mat-icon> Refresh
        </button>
      </div>

      <p *ngIf="loading">Loading coupons...</p>
      <p class="error" *ngIf="listError">{{ listError }}</p>
      <div class="table-wrap" *ngIf="!loading && coupons.length">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Max discount</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let coupon of coupons">
              <td><strong>{{ coupon.code }}</strong></td>
              <td>{{ coupon.discountPercent }}%</td>
              <td>{{ coupon.maxDiscount == null ? "—" : (coupon.maxDiscount | currency) }}</td>
              <td>{{ coupon.usageCount }} / {{ coupon.maxUsageCount ?? "∞" }}</td>
              <td>{{ coupon.expiryDate ? (coupon.expiryDate | date : "medium") : "Never" }}</td>
              <td>
                <span [class.inactive]="!coupon.isActive">
                  {{ coupon.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p *ngIf="!loading && !listError && !coupons.length">No coupons yet. Create one above.</p>
    </section>
  `,
  styles: [
    `
      .create-card,
      .list-card {
        padding: 24px;
        margin-bottom: 24px;
      }

      h2 {
        margin: 0 0 18px;
        font-size: 20px;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        gap: 12px;
      }

      mat-form-field {
        width: 100%;
      }

      .form-actions,
      .list-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-top: 16px;
      }

      .list-heading h2 {
        margin: 0;
      }

      .error {
        color: #b42318;
      }

      .table-wrap {
        overflow-x: auto;
        margin-top: 16px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }

      th,
      td {
        padding: 14px 12px;
        border-bottom: 1px solid var(--bs-border);
        white-space: nowrap;
      }

      th {
        color: var(--bs-muted);
        font-weight: 600;
      }

      .inactive {
        color: #b42318;
      }

      @media (max-width: 600px) {
        .create-card,
        .list-card {
          padding: 16px;
        }

        .form-actions {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponsComponent {
  private readonly couponService = inject(CouponService);
  private readonly fb = inject(FormBuilder);
  private readonly changeDetector = inject(ChangeDetectorRef);
  coupons: CouponModel[] = [];
  loading = false;
  saving = false;
  listError: string | null = null;
  errorMessage: string | null = null;

  readonly form = this.fb.nonNullable.group({
    code: ["", [Validators.required, Validators.maxLength(50)]],
    discountPercent: [10, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    maxDiscount: [""],
    expiryDate: [""],
    maxUsageCount: [""],
    isActive: [true],
  });

  constructor() {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading = true;
    this.listError = null;
    this.couponService
      .getCoupons()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (coupons) => {
          this.coupons = coupons;
          this.changeDetector.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.listError =
            error.error?.message ?? "Could not load coupons. Check your admin access and API connection.";
          this.changeDetector.markForCheck();
        },
      });
  }

  createCoupon(): void {
    if (this.form.invalid || this.saving) {
      return;
    }

    const value = this.form.getRawValue();
    const coupon: CouponCreateModel = {
      code: value.code.trim(),
      discountPercent: value.discountPercent,
      maxDiscount: value.maxDiscount === "" ? null : Number(value.maxDiscount),
      expiryDate: value.expiryDate ? new Date(value.expiryDate).toISOString() : null,
      maxUsageCount: value.maxUsageCount === "" ? null : Number(value.maxUsageCount),
      isActive: value.isActive,
    };

    this.saving = true;
    this.errorMessage = null;
    this.couponService
      .createCoupon(coupon)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.form.reset({
            code: "",
            discountPercent: 10,
            maxDiscount: "",
            expiryDate: "",
            maxUsageCount: "",
            isActive: true,
          });
          this.changeDetector.markForCheck();
          this.loadCoupons();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error?.message ?? "Could not create coupon. Check your admin access and API connection.";
          this.changeDetector.markForCheck();
        },
      });
  }
}
