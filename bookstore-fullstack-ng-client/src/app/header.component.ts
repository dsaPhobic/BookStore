import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { NgIf } from "@angular/common";
import { MatBadgeModule } from "@angular/material/badge";
import { User } from "./account/data/user.model";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    NgIf,
  ],
  template: `
    <p>
      <mat-toolbar color="primary">
        <span routerLink="/home">Book Store 📔</span>
        <span class="example-spacer"></span>
        <button mat-button routerLink="/home" routerLinkActive="active">
          Home
        </button>
        <button mat-button routerLink="/books" routerLinkActive="active">
          Books
        </button>
        <ng-container *ngIf="isLoggedIn; else notLoggedIn">
          <button mat-button routerLink="/dashboard" routerLinkActive="active">
            Dashboard
          </button>
          <button mat-button routerLink="/my-orders" routerLinkActive="active">
            My Orders
          </button>
          <!-- admin routes start -->
          <ng-container *ngIf="isInRole(['Admin'])">
            <button
              mat-button
              routerLink="/manage-books"
              routerLinkActive="active"
            >
              Manage-Books
            </button>

            <button mat-button routerLink="/genres" routerLinkActive="active">
              Manage-Genres
            </button>

            <button mat-button routerLink="/authors" routerLinkActive="active">
              Manage-Authors
            </button>

            <button
              mat-button
              routerLink="/customer-order"
              routerLinkActive="active"
            >
              Customer Order
            </button>
          </ng-container>
          <!-- admin routes ends -->

          <button mat-icon-button color="secondary">
            <mat-icon
              [matBadge]="cartCount"
              matBadgePosition="above after"
              matBadgeColor="accent"
              routerLink="/cart"
            >
              shopping_cart
            </mat-icon>
          </button>

          <button mat-button (click)="logout.emit()">Logout</button>
        </ng-container>

        <ng-template #notLoggedIn>
          <button mat-button routerLink="/login" routerLinkActive="active">
            Login
          </button>
          <button mat-button routerLink="/signup">Signup</button>
        </ng-template>

        <a
          href="https://github.com/rd003/BookStoreFullStackNg"
          target="_blank"
          mat-icon-button
          class="example-icon favorite-icon"
          aria-label="Example icon-button with heart icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
        </a>
      </mat-toolbar>
    </p>
  `,
  styles: [
    `
      .example-spacer {
        flex: 1 1 auto;
      }

      .active {
        background: #003a85;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Output() logout = new EventEmitter();
  @Input({ required: true }) isLoggedIn: boolean = false;
  @Input({ required: true }) user!: User | null;
  @Input({ required: true }) cartCount = 0;

  isInRole(requiredRoles: string[]) {
    const roles = this.user?.roles;
    if (!roles) return false;
    const isAllowed = requiredRoles.some((role) => roles?.includes(role));
    return isAllowed;
  }
}
