import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { DecimalPipe, NgFor, NgIf, AsyncPipe } from "@angular/common";
import {
  Observable,
  catchError,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from "rxjs";
import { Store } from "@ngrx/store";
import { selectUserInfo } from "./account/state/account.selectors";
import { AnalyticsService } from "./dashboard/data/analytics.service";
import {
  DashboardSummary,
  RevenueByPeriod,
  TopSellingBook,
} from "./dashboard/data/dashboard-summary.model";

interface DashboardState {
  summary: DashboardSummary | null;
  error: boolean;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DecimalPipe],
  template: `
    <ng-container *ngIf="userInfo$ | async as userInfo">
      <h1>Welcome {{ userInfo.username }}</h1>
    </ng-container>

    <ng-container *ngIf="isAdmin$ | async">
      <h2>Store analytics</h2>

      <ng-container *ngIf="summaryState$ | async as state">
        <p class="muted" *ngIf="state.error">
          Unable to load analytics. Please try again later.
        </p>

        <ng-container *ngIf="state.summary as summary">
          <div class="stat-grid">
            <div class="stat-card">
              <span class="stat-label">Total revenue</span>
              <span class="stat-value">
                ₹{{ summary.totalRevenue | number : "1.0-2" }}
              </span>
              <span class="stat-sub">
                ₹{{ summary.revenueThisMonth | number : "1.0-2" }} this month
              </span>
            </div>

            <div class="stat-card">
              <span class="stat-label">Completed orders</span>
              <span class="stat-value">{{ summary.completedOrders }}</span>
              <span class="stat-sub">
                out of {{ summary.totalOrders }} orders
              </span>
            </div>

            <div class="stat-card">
              <span class="stat-label">Pending orders</span>
              <span class="stat-value">{{ summary.pendingOrders }}</span>
              <span class="stat-sub">
                {{ summary.cancelledOrders }} cancelled
              </span>
            </div>

            <div class="stat-card">
              <span class="stat-label">Books sold</span>
              <span class="stat-value">{{ summary.totalBooksSold }}</span>
              <span class="stat-sub">
                {{ summary.totalCustomers }} customers
              </span>
            </div>
          </div>

          <div class="panels">
            <section class="panel">
              <h3>Revenue (last 6 months)</h3>

              <div *ngIf="summary.revenueByPeriod.length; else noRevenue">
                <div
                  class="bar-row"
                  *ngFor="let period of summary.revenueByPeriod"
                >
                  <span class="bar-label">{{ period.label }}</span>
                  <div class="bar-track">
                    <div
                      class="bar-fill revenue-bar"
                      [style.width.%]="
                        barWidth(
                          period.revenue,
                          maxRevenue(summary.revenueByPeriod)
                        )
                      "
                    ></div>
                  </div>
                  <span class="bar-value">
                    ₹{{ period.revenue | number : "1.0-0" }}
                  </span>
                </div>
              </div>

              <ng-template #noRevenue>
                <p class="muted">No revenue data yet.</p>
              </ng-template>
            </section>

            <section class="panel">
              <h3>Top 5 best selling books</h3>

              <div *ngIf="summary.topSellingBooks.length; else noBooks">
                <div
                  class="bar-row"
                  *ngFor="let book of summary.topSellingBooks; let i = index"
                >
                  <span class="bar-label" [title]="book.title">
                    {{ i + 1 }}. {{ book.title }}
                  </span>
                  <div class="bar-track">
                    <div
                      class="bar-fill book-bar"
                      [style.width.%]="
                        barWidth(
                          book.quantitySold,
                          maxQuantity(summary.topSellingBooks)
                        )
                      "
                    ></div>
                  </div>
                  <span class="bar-value">{{ book.quantitySold }} sold</span>
                </div>
              </div>

              <ng-template #noBooks>
                <p class="muted">No books sold yet.</p>
              </ng-template>
            </section>
          </div>
        </ng-container>

        <p class="muted" *ngIf="!state.summary && !state.error">
          Loading analytics…
        </p>
      </ng-container>
    </ng-container>
  `,
  styles: [
    `
      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .stat-card {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 1.25rem;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        background-color: #f9f9f9;
        box-shadow: 0 4px 6px #0000001a;
      }

      .stat-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #666;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 700;
      }

      .stat-sub {
        font-size: 13px;
        color: #666;
      }

      .panels {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .panel {
        padding: 1.25rem;
        border-radius: 10px;
        border: 1px solid #e0e0e0;
        background-color: #fff;
        box-shadow: 0 4px 6px #0000001a;
      }

      .panel h3 {
        margin-top: 0;
      }

      .bar-row {
        display: grid;
        grid-template-columns: 12rem 1fr 6rem;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.6rem;
      }

      .bar-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }

      .bar-track {
        height: 14px;
        border-radius: 7px;
        background-color: #eef1f5;
        overflow: hidden;
      }

      .bar-fill {
        height: 100%;
        border-radius: 7px;
        min-width: 2px;
        transition: width 0.3s ease;
      }

      .revenue-bar {
        background-color: #0d6efd;
      }

      .book-bar {
        background-color: #198754;
      }

      .bar-value {
        font-size: 13px;
        text-align: right;
        color: #333;
      }

      .muted {
        color: #666;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private store = inject(Store);
  private analyticsService = inject(AnalyticsService);

  userInfo$ = this.store.select(selectUserInfo);

  isAdmin$ = this.userInfo$.pipe(
    map((user) => user?.roles?.includes("Admin") ?? false),
    distinctUntilChanged(),
    shareReplay(1)
  );

  summaryState$: Observable<DashboardState> = this.isAdmin$.pipe(
    switchMap((isAdmin) => {
      if (!isAdmin) {
        return of<DashboardState>({ summary: null, error: false });
      }

      return this.analyticsService.getDashboardSummary().pipe(
        map((summary) => ({ summary, error: false }) as DashboardState),
        catchError(() => of<DashboardState>({ summary: null, error: true }))
      );
    })
  );

  barWidth(value: number, max: number): number {
    if (!max || max <= 0) {
      return 0;
    }
    return Math.max((value / max) * 100, 0);
  }

  maxRevenue(periods: RevenueByPeriod[]): number {
    return periods.reduce((max, period) => Math.max(max, period.revenue), 0);
  }

  maxQuantity(books: TopSellingBook[]): number {
    return books.reduce((max, book) => Math.max(max, book.quantitySold), 0);
  }
}
