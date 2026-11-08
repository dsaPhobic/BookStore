import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-cart-summary",
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  template: `
    <div class="summary-item">
      <div class="summary-key">SubTotal</div>
      <div class="summary-value">₹{{ subTotal }}</div>
    </div>

    <div class="summary-item">
      <div class="summary-key">Taxes</div>
      <div class="summary-value">₹{{ tax }}</div>
    </div>

    <div class="summary-item">
      <div class="summary-key bolder">Total</div>
      <div class="summary-value bolder">₹{{ total }}</div>
    </div>

    <div class="summary-item">
      <button mat-raised-button routerLink="/create-order" color="primary">
        Checkout
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        flex-grow: 1;
        background-color: #f9f9f9;
        height: 300px;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid rgb(78, 78, 78);
        box-shadow: 0 4px 6px #0000001a;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .summary-item {
        display: flex;
        gap: 10px;
      }

      .bolder {
        font-size: 30px !important;
      }

      .summary-key {
        font-size: 22px;
        font-weight: 700;
      }
      .summary-value {
        font-size: 20px;
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
