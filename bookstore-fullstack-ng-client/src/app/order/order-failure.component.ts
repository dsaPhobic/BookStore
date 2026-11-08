import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-order-failure",
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  template: `
    <p>Your order was failed</p>

    <button mat-raised-button color="primary" routerLink="/books">
      Shop more
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFailureComponent {}
