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
          <span class="hero-eyebrow">
            <mat-icon>auto_awesome</mat-icon> CURATED EDITIONS
          </span>
          <h1>Books that shape how you think, design, and build.</h1>
          <p class="hero-lead">
            From timeless literature and system design to philosophy and science. 
            A curated library with swift, seamless ordering.
          </p>
          <div class="hero-actions">
            <a mat-flat-button class="primary-hero-cta" routerLink="/books">
              <mat-icon>menu_book</mat-icon>
              Explore Catalog
            </a>
            <a mat-stroked-button routerLink="/signup" class="secondary-hero-cta">
              Create Account
            </a>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <strong>100%</strong>
              <span>Verified Editions</span>
            </div>
            <div class="stat">
              <strong>Fast</strong>
              <span>Nationwide Delivery</span>
            </div>
            <div class="stat">
              <strong>Direct</strong>
              <span>Instant Checkout</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="curated-spotlight">
            <div class="spotlight-header">
              <span class="spotlight-badge">Editor's Choice</span>
              <span class="spotlight-year">Volume 2026</span>
            </div>
            <div class="spotlight-book-spine">
              <div class="spine-mark"><mat-icon>menu_book</mat-icon></div>
              <div>
                <h3>Designing Data-Intensive Applications</h3>
                <p class="spotlight-author">Martin Kleppmann</p>
              </div>
            </div>
            <p class="spotlight-desc">
              The definitive guide to the architecture, reliability, and scale of modern distributed systems.
            </p>
            <div class="spotlight-action">
              <span class="spotlight-tag">Distributed Systems</span>
              <a routerLink="/books" class="spotlight-link">View in catalog →</a>
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
            <p>Choose Cash on Delivery or NetBanking at checkout.</p>
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
        background: #090d16;
        color: #fff;
        padding: 72px 24px 80px;
        position: relative;
        border-bottom: 1px solid var(--bs-border);
      }

      .hero-inner {
        max-width: var(--bs-container);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 56px;
        align-items: center;
      }

      .hero-eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 16px;
      }

      .hero-eyebrow .mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        color: #38bdf8;
      }

      .hero-copy h1 {
        font-family: var(--bs-font-heading);
        color: #fff;
        font-size: 46px;
        line-height: 1.15;
        margin: 0 0 20px;
        letter-spacing: -0.02em;
      }

      .hero-lead {
        font-size: 17px;
        line-height: 1.6;
        color: #94a3b8;
        margin: 0 0 32px;
        max-width: 540px;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-bottom: 40px;
      }

      .primary-hero-cta {
        background: #ffffff !important;
        color: #090d16 !important;
        font-weight: 600 !important;
        height: 44px !important;
        padding: 0 22px !important;
        border-radius: var(--bs-radius-sm) !important;
      }

      .secondary-hero-cta {
        border-color: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
        height: 44px !important;
        padding: 0 22px !important;
        border-radius: var(--bs-radius-sm) !important;
      }

      .secondary-hero-cta:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .hero-stats {
        display: flex;
        gap: 36px;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .stat {
        display: flex;
        flex-direction: column;
      }

      .stat strong {
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        font-family: var(--bs-font-sans);
      }

      .stat span {
        font-size: 12px;
        color: #64748b;
        letter-spacing: 0.02em;
      }

      .hero-visual {
        display: flex;
        justify-content: center;
      }

      .curated-spotlight {
        width: 100%;
        max-width: 400px;
        background: #111827;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: var(--bs-radius);
        padding: 28px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      }

      .spotlight-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .spotlight-badge {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: #1e293b;
        color: #38bdf8;
        padding: 4px 10px;
        border-radius: 999px;
      }

      .spotlight-year {
        font-size: 12px;
        color: #64748b;
      }

      .spotlight-book-spine {
        display: flex;
        gap: 14px;
        align-items: flex-start;
        margin-bottom: 14px;
      }

      .spine-mark {
        width: 40px;
        height: 40px;
        border-radius: var(--bs-radius-sm);
        background: #1e293b;
        color: #fff;
        display: grid;
        place-items: center;
        flex-shrink: 0;
      }

      .spotlight-book-spine h3 {
        color: #fff;
        font-size: 18px;
        font-family: var(--bs-font-sans);
        font-weight: 700;
        margin: 0 0 4px;
        line-height: 1.3;
      }

      .spotlight-author {
        margin: 0;
        font-size: 13px;
        color: #94a3b8;
      }

      .spotlight-desc {
        font-size: 13.5px;
        line-height: 1.55;
        color: #94a3b8;
        margin: 0 0 20px;
      }

      .spotlight-action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }

      .spotlight-tag {
        font-size: 12px;
        color: #64748b;
      }

      .spotlight-link {
        font-size: 13px;
        font-weight: 600;
        color: #38bdf8;
        text-decoration: none;
      }

      .spotlight-link:hover {
        text-decoration: underline;
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
