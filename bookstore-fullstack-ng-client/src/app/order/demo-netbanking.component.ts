import { CurrencyPipe, Location, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { OrderService } from "./data/order.service";

@Component({
  selector: "app-demo-netbanking",
  standalone: true,
  imports: [CurrencyPipe, NgIf, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <section class="demo-payment-card surface-card bs-fade-in">
      <div class="demo-icon" aria-hidden="true">
        <mat-icon>account_balance</mat-icon>
      </div>
      <span class="bs-badge bs-badge--accent">DEMO ONLY · DO NOT TRANSFER</span>
      <h1>NetBanking</h1>

      <div class="payment-summary">
        <div>
          <span>Order reference</span>
          <strong>#{{ orderId }}</strong>
        </div>
        <div>
          <span>Bank</span>
          <strong>Vietcombank</strong>
        </div>
        <div>
          <span>Bank account</span>
          <strong>123456789</strong>
        </div>
        <div *ngIf="amount !== null">
          <span>Order amount</span>
          <strong>{{ amount | currency : "USD" }}</strong>
        </div>
      </div>

      <div class="demo-notice" role="note">
        Demo account details only. Do not send money; this action only completes
        the demo order.
      </div>

      <p *ngIf="errorMessage()" class="error-message" role="alert">
        {{ errorMessage() }}
      </p>

      <div class="actions">
        <button
          mat-flat-button
          color="primary"
          type="button"
          [disabled]="isProcessing() || !isOrderIdValid"
          (click)="completePayment()"
        >
          <mat-icon>verified</mat-icon>
          {{
            isProcessing()
              ? "Marking as complete..."
              : "Marks as complete"
          }}
        </button>
        <a mat-stroked-button routerLink="/my-orders">
          Leave payment pending
        </a>
      </div>
    </section>
  `,
  styles: [
    `
      .demo-payment-card {
        max-width: 560px;
        margin: 32px auto;
        padding: 32px;
      }

      .demo-icon {
        display: grid;
        place-items: center;
        width: 58px;
        height: 58px;
        margin-bottom: 18px;
        border-radius: 16px;
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
      }

      .demo-icon mat-icon {
        width: 30px;
        height: 30px;
        font-size: 30px;
      }

      h1 {
        margin: 16px 0 8px;
        font-size: 28px;
      }

      .intro {
        color: var(--bs-muted);
        line-height: 1.6;
      }

      .payment-summary {
        display: grid;
        gap: 12px;
        margin: 24px 0;
        padding: 16px;
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius-sm);
        background: var(--bs-surface-2);
      }

      .payment-summary div {
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }

      .payment-summary span {
        color: var(--bs-muted);
      }

      .payment-summary strong {
        color: var(--bs-ink-dark);
      }

      .demo-notice {
        padding: 12px 14px;
        border-radius: var(--bs-radius-sm);
        background: var(--bs-success-soft);
        color: var(--bs-ink-dark);
        font-size: 14px;
        line-height: 1.5;
      }

      .error-message {
        color: #b3261e;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      @media (max-width: 540px) {
        .demo-payment-card {
          padding: 22px;
        }

        .actions {
          flex-direction: column;
        }

        .actions > * {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoNetBankingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  readonly orderId = Number(this.route.snapshot.paramMap.get("orderId"));
  readonly amount = this.readAmount(this.location.getState());
  readonly isProcessing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isOrderIdValid =
    Number.isSafeInteger(this.orderId) && this.orderId > 0;

  completePayment(): void {
    if (!this.isOrderIdValid || this.isProcessing()) {
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.orderService.completeDemoNetBankingPayment(this.orderId).subscribe({
      next: () => this.router.navigate(["/order-success"]),
      error: () => {
        this.errorMessage.set(
          "The demo payment could not be completed. Please try again."
        );
        this.isProcessing.set(false);
      },
    });
  }

  private readAmount(state: unknown): number | null {
    if (
      typeof state === "object" &&
      state !== null &&
      "amount" in state &&
      typeof state.amount === "number" &&
      Number.isFinite(state.amount)
    ) {
      return state.amount;
    }

    return null;
  }
}
