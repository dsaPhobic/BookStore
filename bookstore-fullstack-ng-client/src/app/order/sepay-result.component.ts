import { NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { OrderService } from "./data/order.service";

@Component({
  selector: "app-sepay-result",
  standalone: true,
  imports: [NgIf, RouterLink, MatButtonModule],
  template: `
    <section class="result-card surface-card bs-fade-in">
      <span class="bs-badge bs-badge--accent">SEPAY SANDBOX</span>
      <h1>Payment status</h1>

      <p *ngIf="isLoading()" role="status">Checking payment confirmation…</p>
      <p *ngIf="status() === 'Completed'" class="success" role="status">
        SePay confirmed your payment. Order #{{ orderId }} is paid.
      </p>
      <p *ngIf="status() === 'Pending'" role="status">
        Your payment is still pending confirmation. You can check again shortly.
      </p>
      <p *ngIf="status() === 'Failed'" class="error" role="alert">
        The payment was not completed. Your order remains available in My Orders.
      </p>
      <p *ngIf="errorMessage()" class="error" role="alert">
        {{ errorMessage() }}
      </p>

      <div class="actions">
        <button
          mat-stroked-button
          type="button"
          [disabled]="isLoading() || !isOrderIdValid"
          (click)="checkStatus()"
        >
          Check status again
        </button>
        <a mat-flat-button color="primary" routerLink="/my-orders">
          Go to my orders
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      .result-card {
        max-width: 560px;
        margin: 32px auto;
        padding: 32px;
      }

      h1 {
        margin: 16px 0;
        font-size: 28px;
      }

      .success {
        color: var(--bs-success, #16804a);
      }

      .error {
        color: #b3261e;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SePayResultComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly orderId = Number(this.route.snapshot.queryParamMap.get("orderId"));
  readonly isOrderIdValid =
    Number.isSafeInteger(this.orderId) && this.orderId > 0;
  readonly isLoading = signal(false);
  readonly status = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    if (!this.isOrderIdValid) {
      this.errorMessage.set("Invalid order reference.");
    } else {
      this.checkStatus();
    }
  }

  checkStatus(): void {
    if (!this.isOrderIdValid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.orderService.getPaymentStatus(this.orderId).subscribe({
      next: (result) => {
        this.status.set(result.status);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set("Could not retrieve the payment status.");
        this.isLoading.set(false);
      },
    });
  }
}
