import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterModule, MatIconModule],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="brand-row">
            <span class="brand-mark"><mat-icon>auto_stories</mat-icon></span>
            <span class="brand-name">Book<span>Store</span></span>
          </div>
          <p class="tagline">
            Curated books on software engineering, architecture, science, and
            timeless literature delivered to your doorstep.
          </p>
        </div>

        <div class="footer-col">
          <h4>Explore</h4>
          <a routerLink="/home">Home</a>
          <a routerLink="/books">Browse Catalog</a>
          <a routerLink="/cart">Shopping Cart</a>
        </div>

        <div class="footer-col">
          <h4>Account</h4>
          <a routerLink="/login">Sign In</a>
          <a routerLink="/signup">Create Account</a>
          <a routerLink="/my-orders">Order History</a>
        </div>

        <div class="footer-col">
          <h4>Tech Stack</h4>
          <span>ASP.NET Core 8 API</span>
          <span>Entity Framework Core & SQLite</span>
          <span>Angular 18 & NgRx Store</span>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ year }} BookStore FullStack. All rights reserved.</span>
        <span>Built with Angular 18 & .NET 8</span>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: auto;
      }

      .site-footer {
        background: var(--bs-ink-dark);
        color: rgba(255, 255, 255, 0.78);
        padding: 48px 24px 24px;
      }

      .footer-inner {
        max-width: var(--bs-container);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.6fr repeat(3, 1fr);
        gap: 32px;
        padding-bottom: 32px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      }

      .brand-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }

      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        background: var(--bs-accent);
        color: #fff;
      }

      .brand-name {
        font-family: var(--bs-font-heading);
        font-size: 20px;
        font-weight: 700;
        color: #fff;
      }

      .brand-name span {
        color: var(--bs-accent);
      }

      .tagline {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.65);
        max-width: 340px;
      }

      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .footer-col h4 {
        margin: 0 0 6px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #fff;
      }

      .footer-col a,
      .footer-col span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.68);
        text-decoration: none;
        transition: color 0.15s ease;
      }

      .footer-col a:hover {
        color: #fff;
      }

      .footer-bottom {
        max-width: var(--bs-container);
        margin: 20px auto 0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
      }

      @media (max-width: 820px) {
        .footer-inner {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 520px) {
        .footer-inner {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
