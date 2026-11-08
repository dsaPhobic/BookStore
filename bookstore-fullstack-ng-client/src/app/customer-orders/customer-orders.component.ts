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

@Component({
  selector: "app-customer-orders",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    CustomerOrderFilter,
    CustomerOrderListComponent,
    CustomerOrderPaginationComponent,
  ],
  template: `
    <h1>Customer Orders</h1>
    <ng-container *ngIf="loading$ | async">Loading...</ng-container>
    <ng-container *ngIf="error$ | async; else noerror">Error</ng-container>

    <ng-template #noerror>
      <app-customer-order-filter
        (filterByPurchaseDate)="handleFilterByPurchaseDate($event)"
        (onSearch)="handleOnSearch($event)"
        (clearFilter)="handleClearFilter()"
      />
      <ng-container *ngIf="customerOrders$ | async as orders">
        <app-customer-order-list
          [customerOrders]="orders"
          (sort)="handleSort($event)"
        />
      </ng-container>

      <ng-container *ngIf="totalCount$ | async as totalCount">
        <app-customer-order-pagination
          (pageSelect)="onPageSelect($event)"
          [totalRecords]="totalCount"
        />
      </ng-container>
    </ng-template>
  `,
  styles: ``,
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
