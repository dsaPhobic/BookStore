import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="surface-card empty-state">
      <mat-icon>find_in_page</mat-icon>
      <h2>404 — Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a mat-flat-button color="primary" routerLink="/home">Back to Home</a>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
