import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-order-success",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="surface-card empty-state status-card">
      <div class="status-icon success">
        <mat-icon>check_circle</mat-icon>
      </div>
      <h2>Order Placed Successfully!</h2>
      <p>
        Thank you for your purchase. You can track your order anytime in your
        order history.
      </p>
      <div class="status-actions">
        <a mat-flat-button color="primary" routerLink="/my-orders">
          View My Orders
        </a>
        <a mat-stroked-button routerLink="/books">Continue Shopping</a>
      </div>
    </div>
  `,
  styles: [
    `
      .status-card {
        max-width: 520px;
        margin: 32px auto;
      }
      .status-icon {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        margin: 0 auto 14px;
        display: grid;
        place-items: center;
      }
      .status-icon.success {
        background: var(--bs-success-soft);
        color: var(--bs-success);
      }
      .status-icon .mat-icon {
        font-size: 38px;
        width: 38px;
        height: 38px;
        color: inherit;
      }
      .status-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderSuccessComponent { }
