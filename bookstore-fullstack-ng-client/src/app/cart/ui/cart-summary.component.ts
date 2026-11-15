import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-cart-summary",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <h3 class="summary-title">Order Summary</h3>

    <div class="summary-row">
      <span>Subtotal</span>
      <strong>\${{ subTotal }}</strong>
    </div>

    <div class="summary-row">
      <span>Estimated Tax (18%)</span>
      <strong>\${{ tax }}</strong>
    </div>

    <div class="summary-row">
      <span>Shipping</span>
      <strong class="free">Free</strong>
    </div>

    <div class="summary-divider"></div>

    <div class="summary-row total-row">
      <span>Total</span>
      <strong>\${{ total }}</strong>
    </div>

    <a
      mat-flat-button
      routerLink="/create-order"
      class="checkout-btn"
    >
      <mat-icon>lock</mat-icon>
      Proceed to Checkout
    </a>
  `,
  styles: [
    `
      :host {
        background: var(--bs-surface);
        padding: 24px;
        border-radius: var(--bs-radius);
        border: 1px solid var(--bs-border);
        box-shadow: var(--bs-shadow-sm);
        display: flex;
        flex-direction: column;
        gap: 14px;
        position: sticky;
        top: 88px;
      }

      .summary-title {
        margin: 0 0 4px;
        font-family: var(--bs-font-sans);
        font-size: 18px;
        font-weight: 700;
        color: var(--bs-ink);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: var(--bs-muted);
      }

      .summary-row strong {
        font-family: var(--bs-font-mono);
        color: var(--bs-ink);
      }

      .free {
        color: var(--bs-success) !important;
        font-family: var(--bs-font-sans) !important;
        font-weight: 600;
      }

      .summary-divider {
        height: 1px;
        background: var(--bs-border);
        margin: 6px 0;
      }

      .total-row {
        font-size: 16px;
        font-weight: 700;
        color: var(--bs-ink);
      }

      .total-row strong {
        font-family: var(--bs-font-mono);
        font-size: 22px;
      }

      .checkout-btn {
        width: 100%;
        height: 46px !important;
        margin-top: 8px;
        background: var(--bs-ink) !important;
        color: #ffffff !important;
        font-weight: 600 !important;
        border-radius: var(--bs-radius-sm) !important;
      }

      .checkout-btn:hover {
        background: #1e293b !important;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassSummaryComponent {
  @Input({ required: true }) subTotal!: Number;
  @Input({ required: true }) tax!: Number;
  @Input({ required: true }) total!: Number;
}
