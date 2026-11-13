import { Store } from "@ngrx/store";
import { userOrderActions } from "./state/user-order/user-order.actions";
import { AsyncPipe, NgIf } from "@angular/common";
import {
  selectUserOrderError,
  selectUserOrderLoading,
  selectUserOrders,
  selectUserOrderTotalCount,
} from "./state/user-order/user-order.selectors";
import { Observable } from "rxjs";
import { UserOrderModel } from "./data/user-order.model";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { UserOrderListComponent } from "./ui/user-order-list.component";
import { PageSelectorModel } from "../common/page-selector.model";
import { UserOrderPaginatorComponent } from "./ui/user-order-paginator.component";
import { UserOrderFilter } from "./ui/user-order-filter.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-user-order",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    UserOrderListComponent,
    UserOrderPaginatorComponent,
    UserOrderFilter,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  template: `
    <div class="orders-page bs-fade-in">
      <div class="bs-page-header">
        <div>
          <span class="bs-badge bs-badge--primary" style="margin-bottom: 8px">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px">
              receipt_long
            </mat-icon>
            Purchase History
          </span>
          <h1 class="bs-page-title">My Orders</h1>
          <p class="bs-page-subtitle">
            Track your purchased books, order dates, and itemized pricing.
          </p>
        </div>
        <a mat-flat-button color="primary" routerLink="/books">
          <mat-icon>storefront</mat-icon>
          Browse More Books
        </a>
      </div>

      <app-user-order-filter
        (filterByPurchaseDate)="handleFilterByPurchaseDate($event)"
        (onSearch)="handleOnSearch($event)"
        (clearFilter)="handleClearFilter()"
      />

      <div *ngIf="loading$ | async" class="loading-box">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <p *ngIf="error$ | async" class="error-box">
        Unable to load your orders. Please try again.
      </p>

      <ng-container *ngIf="userOrders$ | async as orders">
        <div *ngIf="orders.length === 0" class="bs-empty-state">
          <div class="bs-empty-state__icon">
            <mat-icon>shopping_bag</mat-icon>
          </div>
          <div class="bs-empty-state__title">No orders found</div>
          <p class="bs-empty-state__text">
            You haven't placed any orders matching this filter yet.
          </p>
          <a mat-flat-button color="primary" routerLink="/books">
            Explore Catalog
          </a>
        </div>

        <div class="bs-table-shell" *ngIf="orders.length > 0">
          <app-user-order-list [userOrders]="orders" />
          <ng-container *ngIf="totalCount$ | async as totalCount">
            <app-user-order-paginator
              (pageSelect)="onPageSelect($event)"
              [totalRecords]="totalCount"
            />
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .loading-box {
        display: flex;
        justify-content: center;
        padding: 40px 0;
      }

      .error-box {
        padding: 16px;
        border-radius: var(--bs-radius-sm);
        background: #fdecec;
        color: #b3261e;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderComponent {
  private store = inject(Store);
  totalCount$ = this.store.select(selectUserOrderTotalCount);
  loading$ = this.store.select(selectUserOrderLoading);
  error$ = this.store.select(selectUserOrderError);

  userOrders$: Observable<readonly UserOrderModel[]> =
    this.store.select(selectUserOrders);

  loadUserOrders() {
    this.store.dispatch(userOrderActions.getUserOrder());
  }

  onPageSelect(page: PageSelectorModel) {
    this.store.dispatch(userOrderActions.setCurrentPage({ page: page.page }));
    this.store.dispatch(userOrderActions.setPageSize({ pageSize: page.limit }));
    this.loadUserOrders();
  }

  handleClearFilter() {
    this.store.dispatch(userOrderActions.setStartDate({ startDate: null }));
    this.store.dispatch(userOrderActions.setEndDate({ endDate: null }));
    this.store.dispatch(userOrderActions.setSearchTerm({ searchTerm: null }));
    this.loadUserOrders();
  }

  handleFilterByPurchaseDate(range: {
    dateFrom: string | null;
    dateTo: string | null;
  }) {
    const { dateFrom, dateTo } = range;

    if (dateFrom && dateTo) {
      this.store.dispatch(
        userOrderActions.setStartDate({ startDate: dateFrom })
      );
      this.store.dispatch(userOrderActions.setEndDate({ endDate: dateTo }));
      this.loadUserOrders();
    }
  }

  handleOnSearch(searchTerm: string | null) {
    this.store.dispatch(userOrderActions.setSearchTerm({ searchTerm }));
    this.loadUserOrders();
  }

  constructor() {
    this.loadUserOrders();
  }
}
