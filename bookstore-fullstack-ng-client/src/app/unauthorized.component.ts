import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-unauthorized",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="surface-card empty-state">
      <mat-icon>gpp_maybe</mat-icon>
      <h2>403 — Access Restricted</h2>
      <p>Administrator permissions are required to view this page.</p>
      <a mat-flat-button color="primary" routerLink="/login">Sign In as Admin</a>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedComponent {}
