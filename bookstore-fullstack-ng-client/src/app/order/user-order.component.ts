import { Store } from "@ngrx/store";
import { userOrderActions } from "./state/user-order/user-order.actions";
import { AsyncPipe, NgIf } from "@angular/common";
import {
  selectUserOrderError,
  selectUserOrderLoading,
  selectUserOrders,
  selectUserOrderTotalCount,
} from "./state/user-order/user-order.selectors";
import { map, Observable } from "rxjs";
import { UserOrderModel } from "./data/user-order.model";
import { MyOrderModel } from "./data/my-order.model";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { UserOrderListComponent } from "./ui/user-order-list.component";
import { PageSelectorModel } from "../common/page-selector.model";
import { UserOrderPaginatorComponent } from "./ui/user-order-paginator.component";
import { UserOrderFilter } from "./ui/user-order-filter.component";

@Component({
  selector: "app-user-order",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    UserOrderListComponent,
    UserOrderPaginatorComponent,
    UserOrderFilter,
  ],
  template: `
    <h1>My Orders</h1>
    <app-user-order-filter
      (filterByPurchaseDate)="handleFilterByPurchaseDate($event)"
      (onSearch)="handleOnSearch($event)"
      (clearFilter)="handleClearFilter()"
    />
    <ng-container *ngIf="myOrders$ | async as orders">
      <app-user-order-list [userOrders]="orders" />
    </ng-container>

    <ng-container *ngIf="totalCount$ | async as totalCount">
      <app-user-order-paginator
        (pageSelect)="onPageSelect($event)"
        [totalRecords]="totalCount"
      />
    </ng-container>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOrderComponent {
  private store = inject(Store);
  totalCount$ = this.store.select(selectUserOrderTotalCount);
  loading$ = this.store.select(selectUserOrderLoading);
  error$ = this.store.select(selectUserOrderError);

  userOrders$: Observable<readonly UserOrderModel[]> =
    this.store.select(selectUserOrders);

  myOrders$: Observable<MyOrderModel[]> = this.userOrders$.pipe(
    map((orders: readonly UserOrderModel[]) =>
      orders.flatMap((order) =>
        order.orderItems.map((item) => {
          var myOrderItem: MyOrderModel = {
            orderDate: order.orderDate,
            title: item.book.title,
            imageUrl: item.book.imageUrl ?? "",
            price: item.price,
            authorNames: item.book.authorNames,
            genreNames: item.book.genreNames,
            quantity: item.quantity,
          };
          return myOrderItem;
        })
      )
    )
  );

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
