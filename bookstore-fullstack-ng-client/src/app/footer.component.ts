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
            <span class="brand-name">BOOK<span class="accent-dot">.</span>STORE</span>
          </div>
          <p class="tagline">
            A curated sanctuary of literature, system design, and timeless science. 
            Printed with care and delivered nationwide.
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
        background: var(--bs-ink);
        color: rgba(255, 255, 255, 0.75);
        padding: 56px 24px 28px;
        border-top: 1px solid var(--bs-border);
      }

      .footer-inner {
        max-width: var(--bs-container);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1.6fr repeat(3, 1fr);
        gap: 40px;
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .brand-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
      }

      .brand-mark {
        width: 32px;
        height: 32px;
        border-radius: var(--bs-radius-sm);
        display: grid;
        place-items: center;
        background: #ffffff;
        color: var(--bs-ink);
      }

      .brand-name {
        font-family: var(--bs-font-sans);
        font-size: 18px;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #fff;
      }

      .brand-name .accent-dot {
        color: var(--bs-accent);
      }

      .tagline {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.6);
        max-width: 340px;
      }

      .footer-col {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .footer-col h4 {
        margin: 0 0 6px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #fff;
      }

      .footer-col a,
      .footer-col span {
        font-size: 13.5px;
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        transition: color 0.15s ease;
      }

      .footer-col a:hover {
        color: #fff;
      }

      .footer-bottom {
        max-width: var(--bs-container);
        margin: 24px auto 0;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        font-size: 12.5px;
        color: rgba(255, 255, 255, 0.45);
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
