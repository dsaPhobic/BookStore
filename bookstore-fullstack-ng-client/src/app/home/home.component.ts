import { AsyncPipe, NgFor, NgIf, SlicePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Store } from "@ngrx/store";
import { BookActions } from "../book/state/book.actions";
import { selectBooks } from "../book/state/book.selectors";
import { GenreActions } from "../genre/state/genre.actions";
import { selectGenres } from "../genre/state/genre.selectors";
import { BookReadModel } from "../book/Data/book-read.model";
import { CartCreateModel } from "../cart/data/cart-create.model";
import { CartActions } from "../cart/state/cart.actions";
import { BookListPublicComponent } from "../book-public/ui/book-list-public.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    SlicePipe,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    BookListPublicComponent,
  ],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">
            <mat-icon>auto_awesome</mat-icon> CURATED BOOKSHOP
          </span>
          <h1>Discover Books That Shape How You Think & Build</h1>
          <p class="hero-lead">
            From software craftsmanship and system design to timeless science and
            literature—explore our handpicked library with instant checkout.
          </p>
          <div class="hero-actions">
            <a mat-flat-button color="accent" routerLink="/books">
              <mat-icon>menu_book</mat-icon>
              Explore Catalog
            </a>
            <a mat-stroked-button routerLink="/signup" class="secondary-cta">
              Create Free Account
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <strong>100%</strong>
              <span>Authentic Editions</span>
            </div>
            <div class="stat">
              <strong>24/7</strong>
              <span>Instant Ordering</span>
            </div>
            <div class="stat">
              <strong>Free</strong>
              <span>Member Perks</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="showcase-card primary-card">
            <div class="card-badge">Bestseller</div>
            <mat-icon class="card-icon">menu_book</mat-icon>
            <h3>Modern Engineering & Literature</h3>
            <p>Handpicked titles from world-renowned authors and thinkers.</p>
          </div>
          <div class="showcase-card floating-card">
            <mat-icon>verified</mat-icon>
            <div>
              <strong>Curated Collection</strong>
              <span>Updated weekly by editors</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Perks -->
    <section class="section perks-section">
      <div class="perks-grid">
        <div class="perk">
          <div class="perk-icon"><mat-icon>local_shipping</mat-icon></div>
          <div>
            <h4>Fast Delivery</h4>
            <p>Quick nationwide dispatch on every order.</p>
          </div>
        </div>
        <div class="perk">
          <div class="perk-icon"><mat-icon>workspace_premium</mat-icon></div>
          <div>
            <h4>Top-Quality Prints</h4>
            <p>Crisp typography and durable bindings.</p>
          </div>
        </div>
        <div class="perk">
          <div class="perk-icon"><mat-icon>lock</mat-icon></div>
          <div>
            <h4>Secure Checkout</h4>
            <p>Flexible COD, Card, and UPI payment options.</p>
          </div>
        </div>
        <div class="perk">
          <div class="perk-icon"><mat-icon>support_agent</mat-icon></div>
          <div>
            <h4>Dedicated Support</h4>
            <p>Easy order tracking and customer care.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Genres Strip -->
    <ng-container *ngIf="genres$ | async as genres">
      <section class="section" *ngIf="genres.length > 0">
        <div class="section-header">
          <div>
            <span class="eyebrow">CATEGORIES</span>
            <h2>Browse by Genre</h2>
          </div>
          <a mat-button color="primary" routerLink="/books">
            View all genres <mat-icon>arrow_forward</mat-icon>
          </a>
        </div>
        <div class="genre-pills">
          <a
            *ngFor="let g of genres"
            routerLink="/books"
            class="genre-pill"
          >
            <mat-icon>bookmark_border</mat-icon>
            <span>{{ g.genreName }}</span>
          </a>
        </div>
      </section>
    </ng-container>

    <!-- Featured Books -->
    <section class="section">
      <div class="section-header">
        <div>
          <span class="eyebrow">FEATURED SELECTION</span>
          <h2>Popular Reads Right Now</h2>
        </div>
        <a mat-stroked-button color="primary" routerLink="/books">
          Browse Full Catalog
        </a>
      </div>

      <ng-container *ngIf="books$ | async as books">
        <ng-container *ngIf="books.length > 0; else emptyCatalog">
          <app-book-list-public
            [books]="books | slice : 0 : 8"
            (addToCart)="addToCart($event)"
          />
        </ng-container>
        <ng-template #emptyCatalog>
          <div class="surface-card empty-state">
            <mat-icon>auto_stories</mat-icon>
            <h3>Catalog is ready for new titles</h3>
            <p>Sign in as Admin to add books, authors, and genres.</p>
            <a mat-flat-button color="primary" routerLink="/manage-books">
              Manage Books
            </a>
          </div>
        </ng-template>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, #1a234d 0%, #29356a 55%, #3d4d8f 100%);
        color: #fff;
        padding: 64px 24px 72px;
        position: relative;
        overflow: hidden;
      }

      .hero-inner {
        max-width: var(--bs-container);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.25fr 0.9fr;
        gap: 48px;
        align-items: center;
      }

      .hero-copy .eyebrow {
        color: #ffb19c;
        margin-bottom: 12px;
      }

      .hero-copy .eyebrow .mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .hero-copy h1 {
        color: #fff;
        font-size: 46px;
        line-height: 1.15;
        margin: 0 0 18px;
      }

      .hero-lead {
        font-size: 17px;
        line-height: 1.65;
        color: rgba(255, 255, 255, 0.82);
        margin: 0 0 28px;
        max-width: 560px;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-bottom: 36px;
      }

      .secondary-cta {
        border-color: rgba(255, 255, 255, 0.35) !important;
        color: #fff !important;
      }

      .hero-stats {
        display: flex;
        gap: 32px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.14);
      }

      .stat {
        display: flex;
        flex-direction: column;
      }

      .stat strong {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
      }

      .stat span {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.68);
      }

      .hero-visual {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .showcase-card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(14px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: var(--bs-radius-lg);
        padding: 28px;
        color: #fff;
      }

      .primary-card h3 {
        color: #fff;
        font-size: 24px;
        margin: 12px 0 8px;
      }

      .primary-card p {
        margin: 0;
        color: rgba(255, 255, 255, 0.78);
      }

      .card-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--bs-accent);
        font-size: 12px;
        font-weight: 600;
      }

      .card-icon {
        display: block;
        font-size: 42px;
        width: 42px;
        height: 42px;
        margin-top: 14px;
        color: #ffb19c;
      }

      .floating-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 18px 22px;
      }

      .floating-card .mat-icon {
        color: #ffb19c;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .floating-card strong {
        display: block;
        font-size: 15px;
      }

      .floating-card span {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.72);
      }

      .section {
        max-width: var(--bs-container);
        margin: 0 auto;
        padding: 40px 24px 16px;
      }

      .perks-section {
        padding-top: 28px;
      }

      .perks-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
      }

      .perk {
        background: var(--bs-surface);
        border: 1px solid var(--bs-border);
        border-radius: var(--bs-radius);
        padding: 18px;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        box-shadow: var(--bs-shadow-sm);
      }

      .perk-icon {
        width: 42px;
        height: 42px;
        border-radius: 10px;
        background: var(--bs-ink-soft);
        color: var(--bs-ink);
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .perk h4 {
        margin: 0 0 4px;
        font-size: 15px;
        font-weight: 600;
        color: var(--bs-ink-dark);
      }

      .perk p {
        margin: 0;
        font-size: 13px;
        color: var(--bs-muted);
        line-height: 1.45;
      }

      .section-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 22px;
      }

      .section-header h2 {
        margin: 4px 0 0;
        font-size: 28px;
      }

      .genre-pills {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .genre-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 999px;
        background: var(--bs-surface);
        border: 1px solid var(--bs-border);
        color: var(--bs-ink-dark);
        font-weight: 500;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.15s ease;
      }

      .genre-pill:hover {
        border-color: var(--bs-ink);
        background: var(--bs-ink-soft);
        transform: translateY(-1px);
      }

      .genre-pill .mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--bs-accent);
      }

      @media (max-width: 960px) {
        .hero-inner {
          grid-template-columns: 1fr;
        }
        .perks-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .hero-copy h1 {
          font-size: 34px;
        }
      }

      @media (max-width: 560px) {
        .perks-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  books$ = this.store.select(selectBooks);
  genres$ = this.store.select(selectGenres);

  constructor() {
    this.store.dispatch(BookActions.setPageSize({ pageSize: 12 }));
    this.store.dispatch(GenreActions.loadGenre());
    this.store.dispatch(BookActions.loadBooks());
  }

  addToCart(book: BookReadModel) {
    const cartItem: CartCreateModel = {
      bookId: book.id,
      quantity: 1,
    };
    this.store.dispatch(CartActions.addCartItem({ cartItem }));
    this.snackBar.open(`"${book.title}" added to cart`, "Close", {
      duration: 2500,
    });
  }
}
