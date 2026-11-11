import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { selectUserInfo } from "./account/state/account.selectors";
import { Store } from "@ngrx/store";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { selectBookTotalCount, selectBooks } from "./book/state/book.selectors";
import { selectAuthorTotalCount } from "./authors/state/author.selectors";
import { selectGenres } from "./genre/state/genre.selectors";
import { selectCartCount } from "./cart/state/cart.selectors";
import { BookActions } from "./book/state/book.actions";
import { authorActions } from "./authors/state/author.actions";
import { GenreActions } from "./genre/state/genre.actions";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <ng-container *ngIf="userInfo$ | async as userInfo">
      <div class="welcome-banner">
        <div>
          <span class="eyebrow">OVERVIEW DASHBOARD</span>
          <h1>Welcome back, {{ userInfo.username }}</h1>
          <p>
            {{
              isAdmin(userInfo.roles)
                ? "Manage your book catalog, authors, genres, and customer orders from one place."
                : "Track your orders, manage your cart, and discover new books."
            }}
          </p>
        </div>
        <div class="banner-actions">
          <a mat-flat-button color="accent" routerLink="/books">
            <mat-icon>auto_stories</mat-icon> Browse Storefront
          </a>
          <a
            *ngIf="isAdmin(userInfo.roles)"
            mat-stroked-button
            class="light-btn"
            routerLink="/manage-books"
          >
            <mat-icon>add</mat-icon> Manage Catalog
          </a>
        </div>
      </div>

      <!-- KPI Metric Cards -->
      <div class="stats-grid">
        <div class="stat-card surface-card">
          <div class="stat-icon ink"><mat-icon>menu_book</mat-icon></div>
          <div>
            <span class="stat-label">Total Books</span>
            <strong class="stat-value">{{
              (bookCount$ | async) || (books$ | async)?.length || 0
            }}</strong>
          </div>
        </div>

        <div class="stat-card surface-card">
          <div class="stat-icon coral"><mat-icon>category</mat-icon></div>
          <div>
            <span class="stat-label">Book Genres</span>
            <strong class="stat-value">{{
              (genres$ | async)?.length ?? 0
            }}</strong>
          </div>
        </div>

        <div class="stat-card surface-card" *ngIf="isAdmin(userInfo.roles)">
          <div class="stat-icon green"><mat-icon>people_outline</mat-icon></div>
          <div>
            <span class="stat-label">Registered Authors</span>
            <strong class="stat-value">{{
              (authorCount$ | async) ?? 0
            }}</strong>
          </div>
        </div>

        <div class="stat-card surface-card">
          <div class="stat-icon gold"><mat-icon>shopping_bag</mat-icon></div>
          <div>
            <span class="stat-label">Items in Cart</span>
            <strong class="stat-value">{{ (cartCount$ | async) ?? 0 }}</strong>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <ng-container *ngIf="isAdmin(userInfo.roles)">
          <a class="action-card surface-card" routerLink="/manage-books">
            <mat-icon>library_books</mat-icon>
            <h3>Manage Books</h3>
            <p>Add, edit, upload covers, and organize book inventory.</p>
          </a>
          <a class="action-card surface-card" routerLink="/authors">
            <mat-icon>Badge</mat-icon>
            <h3>Manage Authors</h3>
            <p>Create and maintain author profiles and records.</p>
          </a>
          <a class="action-card surface-card" routerLink="/genres">
            <mat-icon>sell</mat-icon>
            <h3>Manage Genres</h3>
            <p>Curate categories so readers can filter books effortlessly.</p>
          </a>
          <a class="action-card surface-card" routerLink="/customer-order">
            <mat-icon>receipt_long</mat-icon>
            <h3>Customer Orders</h3>
            <p>Review all customer purchases, payments, and order items.</p>
          </a>
        </ng-container>

        <a class="action-card surface-card" routerLink="/my-orders">
          <mat-icon>local_shipping</mat-icon>
          <h3>My Orders</h3>
          <p>Check your personal order history and payment status.</p>
        </a>
        <a class="action-card surface-card" routerLink="/cart">
          <mat-icon>shopping_cart_checkout</mat-icon>
          <h3>Shopping Cart</h3>
          <p>Review items in your bag and proceed to checkout.</p>
        </a>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .welcome-banner {
        background: linear-gradient(135deg, #1a234d 0%, #29356a 100%);
        color: #fff;
        padding: 32px;
        border-radius: var(--bs-radius-lg);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
        margin-bottom: 28px;
      }

      .welcome-banner .eyebrow {
        color: #ffb19c;
      }

      .welcome-banner h1 {
        color: #fff;
        margin: 6px 0 8px;
        font-size: 30px;
      }

      .welcome-banner p {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
      }

      .banner-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .light-btn {
        border-color: rgba(255, 255, 255, 0.35) !important;
        color: #fff !important;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin-bottom: 32px;
      }

      .stat-card {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .stat-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: grid;
        place-items: center;
      }

      .stat-icon.ink {
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
      }
      .stat-icon.coral {
        background: var(--bs-accent-soft);
        color: var(--bs-accent);
      }
      .stat-icon.green {
        background: var(--bs-success-soft);
        color: var(--bs-success);
      }
      .stat-icon.gold {
        background: #fef3c7;
        color: #b45309;
      }

      .stat-label {
        display: block;
        font-size: 13px;
        color: var(--bs-muted);
      }

      .stat-value {
        font-size: 26px;
        font-weight: 700;
        color: var(--bs-ink-dark);
      }

      .section-title {
        font-size: 22px;
        margin: 0 0 16px;
      }

      .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 18px;
      }

      .action-card {
        text-decoration: none;
        color: inherit;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
      }

      .action-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--bs-shadow);
      }

      .action-card .mat-icon {
        color: var(--bs-accent);
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .action-card h3 {
        font-size: 18px;
        margin: 10px 0 6px;
      }

      .action-card p {
        margin: 0;
        font-size: 13.5px;
        color: var(--bs-muted);
        line-height: 1.5;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  store = inject(Store);
  userInfo$ = this.store.select(selectUserInfo);
  books$ = this.store.select(selectBooks);
  bookCount$ = this.store.select(selectBookTotalCount);
  authorCount$ = this.store.select(selectAuthorTotalCount);
  genres$ = this.store.select(selectGenres);
  cartCount$ = this.store.select(selectCartCount);

  constructor() {
    this.store.dispatch(BookActions.loadBooks());
    this.store.dispatch(GenreActions.loadGenre());
    this.store.dispatch(authorActions.loadAuthors());
  }

  isAdmin(roles?: string[]) {
    return roles?.includes("Admin") ?? false;
  }
}
