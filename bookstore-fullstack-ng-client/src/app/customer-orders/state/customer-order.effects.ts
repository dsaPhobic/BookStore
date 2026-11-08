import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, of, switchMap } from "rxjs";
import { concatLatestFrom } from "@ngrx/operators";
import { OrderService } from "../../order/data/order.service";
import { customerOrderActions } from "./customer-order.actions";
import { selectCustomerOrderState } from "./customer-order.selectors";

@Injectable()
export class CustomerOrderEffects {
  actions$ = inject(Actions);
  orderService = inject(OrderService);
  store = inject(Store);

  loadAuthors = createEffect(() =>
    this.actions$.pipe(
      ofType(customerOrderActions.getCustomerOrder),
      concatLatestFrom(() => [this.store.select(selectCustomerOrderState)]),
      switchMap(([action, state]) =>
        this.orderService
          .getCustomerOrders({
            pageSize: state.pageSize,
            pageNumber: state.pageNumber,
            searchTerm: state.searchTerm ?? "",
            startDate: state.startDate ?? "",
            endDate: state.endDate ?? "",
            sortBy: state.sortBy,
          })
          .pipe(
            switchMap((data) => {
              return [
                customerOrderActions.getCustomerOrderSuccess({
                  orders: data.items,
                }),
                customerOrderActions.setTotalCount({
                  totalCount: data.totalCount,
                }),
              ];
            }),
            catchError((error) =>
              of(customerOrderActions.getCustomerOrderFailure({ error }))
            )
          )
      )
    )
  );
}
