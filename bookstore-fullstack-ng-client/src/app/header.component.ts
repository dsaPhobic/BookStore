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
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
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
    MatMenuModule,
    MatDividerModule,
    NgIf,
  ],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <!-- Brand -->
        <a class="brand" routerLink="/home">
          <span class="brand-mark"><mat-icon>auto_stories</mat-icon></span>
          <span class="brand-name">Book<span>Store</span></span>
        </a>

        <!-- Primary navigation (desktop) -->
        <nav class="nav-links">
          <a routerLink="/home" routerLinkActive="active">Home</a>
          <a routerLink="/books" routerLinkActive="active">Books</a>
          <ng-container *ngIf="isLoggedIn">
            <a routerLink="/my-orders" routerLinkActive="active">My Orders</a>
            <button
              *ngIf="isInRole(['Admin'])"
              class="nav-menu-trigger"
              [matMenuTriggerFor]="adminMenu"
            >
              Manage <mat-icon>expand_more</mat-icon>
            </button>
          </ng-container>
        </nav>

        <span class="spacer"></span>

        <!-- Right actions -->
        <ng-container *ngIf="isLoggedIn; else guestActions">
          <a
            mat-icon-button
            class="icon-action"
            routerLink="/cart"
            aria-label="Cart"
          >
            <mat-icon
              [matBadge]="cartCount"
              [matBadgeHidden]="!cartCount"
              matBadgeColor="accent"
              matBadgeSize="small"
              >shopping_bag</mat-icon
            >
          </a>

          <button class="user-chip" [matMenuTriggerFor]="userMenu">
            <span class="avatar">{{ initial }}</span>
            <span class="user-name">{{ user?.username }}</span>
            <mat-icon>expand_more</mat-icon>
          </button>
        </ng-container>

        <ng-template #guestActions>
          <div class="guest-actions">
            <a mat-button routerLink="/login">Log in</a>
            <a mat-flat-button color="accent" routerLink="/signup">Sign up</a>
          </div>
        </ng-template>

        <!-- Repository link -->
        <a
          mat-icon-button
          class="icon-action github-link"
          href="https://github.com/dsaPhobic/BookStore.git"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="BookStore repository on GitHub"
        >
          <mat-icon>code</mat-icon>
        </a>

        <!-- Mobile menu trigger -->
        <button
          mat-icon-button
          class="mobile-trigger"
          [matMenuTriggerFor]="mobileMenu"
          aria-label="Menu"
        >
          <mat-icon>menu</mat-icon>
        </button>
      </div>
    </header>

    <!-- Admin menu -->
    <mat-menu #adminMenu="matMenu" xPosition="after">
      <a mat-menu-item routerLink="/manage-books">
        <mat-icon>menu_book</mat-icon><span>Books</span>
      </a>
      <a mat-menu-item routerLink="/authors">
        <mat-icon>person_outline</mat-icon><span>Authors</span>
      </a>
      <a mat-menu-item routerLink="/genres">
        <mat-icon>category</mat-icon><span>Genres</span>
      </a>
      <mat-divider></mat-divider>
      <a mat-menu-item routerLink="/customer-order">
        <mat-icon>receipt_long</mat-icon><span>Customer Orders</span>
      </a>
    </mat-menu>

    <!-- User menu -->
    <mat-menu #userMenu="matMenu" xPosition="before">
      <div class="menu-user-info">
        <div class="avatar avatar-lg">{{ initial }}</div>
        <div>
          <div class="menu-user-name">{{ user?.username }}</div>
          <div class="menu-user-role">
            {{ isInRole(["Admin"]) ? "Administrator" : "Customer" }}
          </div>
        </div>
      </div>
      <mat-divider></mat-divider>
      <a mat-menu-item routerLink="/dashboard">
        <mat-icon>space_dashboard</mat-icon><span>Dashboard</span>
      </a>
      <a mat-menu-item routerLink="/my-orders">
        <mat-icon>local_shipping</mat-icon><span>My Orders</span>
      </a>
      <a mat-menu-item routerLink="/cart">
        <mat-icon>shopping_bag</mat-icon><span>Cart ({{ cartCount }})</span>
      </a>
      <mat-divider></mat-divider>
      <button mat-menu-item (click)="logout.emit()">
        <mat-icon>logout</mat-icon><span>Log out</span>
      </button>
    </mat-menu>

    <!-- Mobile menu -->
    <mat-menu #mobileMenu="matMenu" xPosition="before">
      <a mat-menu-item routerLink="/home">
        <mat-icon>home</mat-icon><span>Home</span>
      </a>
      <a mat-menu-item routerLink="/books">
        <mat-icon>auto_stories</mat-icon><span>Books</span>
      </a>
      <ng-container *ngIf="isLoggedIn; else mobileGuest">
        <a mat-menu-item routerLink="/my-orders">
          <mat-icon>local_shipping</mat-icon><span>My Orders</span>
        </a>
        <a mat-menu-item routerLink="/cart">
          <mat-icon>shopping_bag</mat-icon><span>Cart ({{ cartCount }})</span>
        </a>
        <ng-container *ngIf="isInRole(['Admin'])">
          <mat-divider></mat-divider>
          <a mat-menu-item routerLink="/manage-books">
            <mat-icon>menu_book</mat-icon><span>Manage Books</span>
          </a>
          <a mat-menu-item routerLink="/authors">
            <mat-icon>person_outline</mat-icon><span>Manage Authors</span>
          </a>
          <a mat-menu-item routerLink="/genres">
            <mat-icon>category</mat-icon><span>Manage Genres</span>
          </a>
          <a mat-menu-item routerLink="/customer-order">
            <mat-icon>receipt_long</mat-icon><span>Customer Orders</span>
          </a>
        </ng-container>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout.emit()">
          <mat-icon>logout</mat-icon><span>Log out</span>
        </button>
      </ng-container>
      <ng-template #mobileGuest>
        <mat-divider></mat-divider>
        <a mat-menu-item routerLink="/login">
          <mat-icon>login</mat-icon><span>Log in</span>
        </a>
        <a mat-menu-item routerLink="/signup">
          <mat-icon>person_add</mat-icon><span>Sign up</span>
        </a>
      </ng-template>
    </mat-menu>
  `,
  styles: [
    `
      :host {
        position: sticky;
        top: 0;
        z-index: 100;
        display: block;
      }

      .site-header {
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: saturate(180%) blur(12px);
        border-bottom: 1px solid var(--bs-border);
      }

      .header-inner {
        max-width: var(--bs-container);
        margin: 0 auto;
        height: 68px;
        padding: 0 24px;
        display: flex;
        align-items: center;
        gap: 28px;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .brand-mark {
        width: 38px;
        height: 38px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--bs-ink) 0%, #465696 100%);
        color: #fff;
        box-shadow: 0 6px 16px rgba(41, 53, 106, 0.25);
      }

      .brand-mark .mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .brand-name {
        font-family: var(--bs-font-heading);
        font-size: 22px;
        font-weight: 700;
        color: var(--bs-ink-dark);
      }

      .brand-name span {
        color: var(--bs-accent);
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .nav-links a,
      .nav-menu-trigger {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 38px;
        padding: 0 14px;
        border-radius: 10px;
        border: none;
        background: transparent;
        font: inherit;
        font-size: 15px;
        font-weight: 500;
        color: var(--bs-muted);
        text-decoration: none;
        cursor: pointer;
        transition: color 0.15s ease, background 0.15s ease;
      }

      .nav-links a:hover,
      .nav-menu-trigger:hover {
        color: var(--bs-ink-dark);
        background: var(--bs-surface-2);
      }

      .nav-links a.active {
        color: var(--bs-ink-dark);
        background: var(--bs-ink-soft);
      }

      .nav-menu-trigger .mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .spacer {
        flex: 1 1 auto;
      }

      .icon-action {
        color: var(--bs-ink-dark);
      }

      .github-link {
        color: var(--bs-muted);
        transition: color 0.15s ease;
      }

      .github-link:hover {
        color: var(--bs-ink-dark);
      }

      .guest-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .user-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px 4px 4px;
        border: 1px solid var(--bs-border);
        border-radius: 999px;
        background: var(--bs-surface);
        font: inherit;
        cursor: pointer;
        transition: box-shadow 0.15s ease;
      }

      .user-chip:hover {
        box-shadow: var(--bs-shadow-sm);
      }

      .user-chip .mat-icon {
        color: var(--bs-muted);
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .user-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--bs-ink-dark);
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: var(--bs-accent);
        color: #fff;
        font-weight: 700;
        font-size: 14px;
        text-transform: uppercase;
      }

      .avatar-lg {
        width: 42px;
        height: 42px;
        font-size: 17px;
      }

      .menu-user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        min-width: 220px;
      }

      .menu-user-name {
        font-weight: 600;
        color: var(--bs-ink-dark);
      }

      .menu-user-role {
        font-size: 12px;
        color: var(--bs-muted);
      }

      .mobile-trigger {
        display: none;
      }

      @media (max-width: 900px) {
        .nav-links,
        .guest-actions,
        .user-name {
          display: none;
        }

        .mobile-trigger {
          display: inline-flex;
        }

        .header-inner {
          gap: 12px;
          padding: 0 14px;
        }
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

  get initial(): string {
    return (this.user?.username ?? "?").charAt(0);
  }

  isInRole(requiredRoles: string[]) {
    const roles = this.user?.roles;
    if (!roles) return false;
    const isAllowed = requiredRoles.some((role) => roles?.includes(role));
    return isAllowed;
  }
}
