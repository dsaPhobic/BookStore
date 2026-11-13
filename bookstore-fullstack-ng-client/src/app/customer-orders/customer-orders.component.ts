import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { customerOrderActions } from "./state/customer-order.actions";
import { UserOrderModel } from "../order/data/user-order.model";
import { Observable } from "rxjs";
import {
  selectCustomerOrderError,
  selectCustomerOrderLoading,
  selectCustomerOrders,
  selectCustomerOrderTotalCount,
} from "./state/customer-order.selectors";
import { PageSelectorModel } from "../common/page-selector.model";
import { Store } from "@ngrx/store";
import { CustomerOrderFilter } from "./ui/customer-order-filter.component";
import { CustomerOrderListComponent } from "./ui/customer-order-list.component";
import { CustomerOrderPaginationComponent } from "./ui/customer-order-pagination";
import { AsyncPipe, NgIf } from "@angular/common";
import { SortModel } from "../common/sort.model";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: "app-customer-orders",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CustomerOrderFilter,
    CustomerOrderListComponent,
    CustomerOrderPaginationComponent,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="customer-orders-page bs-fade-in">
      <div class="bs-page-header">
        <div>
          <span class="bs-badge bs-badge--accent" style="margin-bottom: 8px">
            <mat-icon style="font-size: 14px; width: 14px; height: 14px">
              admin_panel_settings
            </mat-icon>
            Store Operations
          </span>
          <h1 class="bs-page-title">Customer Orders</h1>
          <p class="bs-page-subtitle">
            Monitor incoming orders, customer contact details, and order totals.
          </p>
        </div>
      </div>

      <app-customer-order-filter
        (filterByPurchaseDate)="handleFilterByPurchaseDate($event)"
        (onSearch)="handleOnSearch($event)"
        (clearFilter)="handleClearFilter()"
      />

      <div *ngIf="loading$ | async" class="loading-box">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <ng-container *ngIf="customerOrders$ | async as orders">
        <div *ngIf="orders.length === 0" class="bs-empty-state">
          <div class="bs-empty-state__icon">
            <mat-icon>inbox</mat-icon>
          </div>
          <div class="bs-empty-state__title">No customer orders yet</div>
          <p class="bs-empty-state__text">
            Customer orders will appear here once purchases are completed.
          </p>
        </div>

        <div class="bs-table-shell" *ngIf="orders.length > 0">
          <app-customer-order-list
            [customerOrders]="orders"
            (sort)="handleSort($event)"
          />
          <ng-container *ngIf="totalCount$ | async as totalCount">
            <app-customer-order-pagination
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerOrdersComponent {
  private store = inject(Store);
  totalCount$ = this.store.select(selectCustomerOrderTotalCount);
  loading$ = this.store.select(selectCustomerOrderLoading);
  error$ = this.store.select(selectCustomerOrderError);

  customerOrders$: Observable<readonly UserOrderModel[]> =
    this.store.select(selectCustomerOrders);

  loadUserOrders() {
    this.store.dispatch(customerOrderActions.getCustomerOrder());
  }

  onPageSelect(page: PageSelectorModel) {
    this.store.dispatch(
      customerOrderActions.setCurrentPage({ page: page.page })
    );
    this.store.dispatch(
      customerOrderActions.setPageSize({ pageSize: page.limit })
    );
    this.loadUserOrders();
  }

  handleClearFilter() {
    this.store.dispatch(customerOrderActions.setStartDate({ startDate: null }));
    this.store.dispatch(customerOrderActions.setEndDate({ endDate: null }));
    this.store.dispatch(
      customerOrderActions.setSearchTerm({ searchTerm: null })
    );
    this.loadUserOrders();
  }
  handleFilterByPurchaseDate(range: {
    dateFrom: string | null;
    dateTo: string | null;
  }) {
    const { dateFrom, dateTo } = range;

    if (dateFrom && dateTo) {
      this.store.dispatch(
        customerOrderActions.setStartDate({ startDate: dateFrom })
      );
      this.store.dispatch(customerOrderActions.setEndDate({ endDate: dateTo }));
      this.loadUserOrders();
    }
  }

  handleOnSearch(searchTerm: string | null) {
    this.store.dispatch(customerOrderActions.setSearchTerm({ searchTerm }));
    this.loadUserOrders();
  }

  handleSort(sortData: SortModel) {
    this.store.dispatch(
      customerOrderActions.setSortBy({
        sortBy: `${sortData.sortColumn} ${sortData.sortDirection}`,
      })
    );
    this.loadUserOrders();
  }

  constructor() {
    this.loadUserOrders();
  }
}
