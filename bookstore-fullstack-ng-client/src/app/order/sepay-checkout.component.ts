import { DecimalPipe, NgFor, NgIf } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  numberAttribute,
  signal,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { OrderService } from "./data/order.service";
import { SePayCheckoutSessionModel } from "./data/sepay-payment.model";

@Component({
  selector: "app-sepay-checkout",
  standalone: true,
  imports: [DecimalPipe, NgFor, NgIf, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="payment-card surface-card bs-fade-in">
      <div class="payment-icon" aria-hidden="true">
        <mat-icon>account_balance</mat-icon>
      </div>
      <span class="bs-badge bs-badge--accent">SEPAY SANDBOX</span>
      <h1>Continue to SePay</h1>
      <p class="intro">
        This is a sandbox payment. No real money will be charged.
      </p>

      <div *ngIf="session() as checkout" class="payment-summary">
        <div>
          <span>Order reference</span>
          <strong>#{{ checkout.orderId }}</strong>
        </div>
        <div>
          <span>Payment amount</span>
          <strong>{{ checkout.amountVnd | number }} VND</strong>
        </div>
      </div>

      <p *ngIf="isLoading()" role="status">Preparing secure checkout…</p>
      <p *ngIf="errorMessage()" class="error-message" role="alert">
        {{ errorMessage() }}
      </p>

      <form
        *ngIf="session() as checkout"
        #checkoutForm
        [attr.action]="checkout.checkoutUrl"
        method="post"
        class="checkout-form"
      >
        <input
          *ngFor="let field of checkout.fields"
          type="hidden"
          [attr.name]="field.name"
          [value]="field.value"
        />
      </form>

      <div class="actions">
        <button
          *ngIf="session()"
          mat-flat-button
          color="primary"
          type="button"
          (click)="continueToSePay()"
        >
          <mat-icon>open_in_new</mat-icon>
          Continue to SePay Sandbox
        </button>
        <a mat-stroked-button routerLink="/my-orders">Return to my orders</a>
      </div>
    </section>
  `,
  styles: [
    `
      .payment-card {
        max-width: 560px;
        margin: 32px auto;
        padding: 32px;
      }

      .payment-icon {
        display: grid;
        place-items: center;
        width: 58px;
        height: 58px;
        margin-bottom: 18px;
        border-radius: 16px;
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
      }

      .payment-icon mat-icon {
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
        .payment-card {
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
export class SePayCheckoutComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  @ViewChild("checkoutForm") private checkoutForm?: ElementRef<HTMLFormElement>;

  readonly orderId = numberAttribute(
    this.route.snapshot.paramMap.get("orderId")
  );
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly session = signal<SePayCheckoutSessionModel | null>(null);

  constructor() {
    if (!Number.isSafeInteger(this.orderId) || this.orderId < 1) {
      this.isLoading.set(false);
      this.errorMessage.set("Invalid order reference.");
      return;
    }

    this.orderService.getSePayCheckout(this.orderId).subscribe({
      next: (session) => {
        this.session.set(session);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          "Could not prepare SePay checkout. Your order remains pending."
        );
        this.isLoading.set(false);
      },
    });
  }

  continueToSePay(): void {
    this.checkoutForm?.nativeElement.submit();
  }
}
