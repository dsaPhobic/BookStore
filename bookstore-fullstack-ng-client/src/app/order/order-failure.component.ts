import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-order-failure",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="surface-card empty-state status-card">
      <div class="status-icon danger">
        <mat-icon>error_outline</mat-icon>
      </div>
      <h2>Order Could Not Be Completed</h2>
      <p>Something went wrong while placing your order. Please try again.</p>
      <div class="status-actions">
        <a mat-flat-button color="accent" routerLink="/cart">Return to Cart</a>
        <a mat-stroked-button routerLink="/books">Browse Books</a>
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
        background: #fdecec;
        color: #d32f2f;
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
export class OrderFailureComponent {}
